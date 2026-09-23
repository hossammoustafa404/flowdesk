import {
  ADMIN_ORIGIN,
  SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD,
  WEB_ORIGIN,
  cookieHeader,
  createVerifiedCustomerSession,
  getSession,
  hasSessionCookie,
  signIn,
  signOut,
  signUpCustomer,
  uniqueCustomerEmail,
  uniqueOrganizationSlug,
  verifyCustomerEmail,
} from '../support/auth-client';
import {
  createOrganization,
  getActiveMember,
  getFullOrganization,
  listOrganizations,
  setActiveOrganization,
} from '../support/organization-client';

describe('Customer Organization workspace', () => {
  it('should create the Organization and Owner seat on Sign-up without a Session', async () => {
    const email = uniqueCustomerEmail();
    const organizationName = `Workspace ${uniqueOrganizationSlug()}`;

    const signedUp = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName,
    });

    expect(signedUp.status).toBe(200);
    expect(hasSessionCookie(signedUp.headers['set-cookie'])).toBe(false);

    const beforeVerify = await signIn({
      email,
      password: 'customer-password-1',
      origin: WEB_ORIGIN,
    });
    expect(beforeVerify.status).toBeGreaterThanOrEqual(400);

    await verifyCustomerEmail(email);
    const signInRes = await signIn({
      email,
      password: 'customer-password-1',
      origin: WEB_ORIGIN,
    });
    const session = {
      cookie: cookieHeader(signInRes.headers['set-cookie']),
      origin: WEB_ORIGIN,
    };
    const listed = await listOrganizations(session);
    const membership = await getActiveMember(session);

    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([
      expect.objectContaining({ name: organizationName }),
    ]);
    expect(membership.status).toBe(200);
    expect(membership.data.role).toBe('owner');
    expect(String(membership.data.organizationId)).toBe(
      String(listed.data[0].id),
    );
  });

  it('should set Active Organization on the Session after Email verification', async () => {
    const email = uniqueCustomerEmail();
    const organizationName = `Workspace ${uniqueOrganizationSlug()}`;
    await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName,
    });

    const verify = await verifyCustomerEmail(email);
    expect(verify.status).toBe(200);

    let sessionCookie = cookieHeader(verify.headers['set-cookie']);
    if (!hasSessionCookie(verify.headers['set-cookie'])) {
      const signInRes = await signIn({
        email,
        password: 'customer-password-1',
        origin: WEB_ORIGIN,
      });
      sessionCookie = cookieHeader(signInRes.headers['set-cookie']);
    }

    const session = { cookie: sessionCookie, origin: WEB_ORIGIN };
    const listed = await listOrganizations(session);
    const current = await getSession(session);

    expect(listed.data).toHaveLength(1);
    expect(listed.data[0].name).toBe(organizationName);
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(listed.data[0].id),
    );
  });

  it('should reject Sign-up when Organization name is missing without creating a User', async () => {
    const email = uniqueCustomerEmail();

    const res = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName: null,
    });
    const duplicate = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName: `Workspace ${uniqueOrganizationSlug()}`,
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(hasSessionCookie(res.headers['set-cookie'])).toBe(false);
    expect(duplicate.status).toBe(200);
  });

  it('should reject Sign-up when Organization name is invalid without creating a User', async () => {
    const email = uniqueCustomerEmail();

    const res = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName: 'x'.repeat(101),
    });
    const retry = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName: `Workspace ${uniqueOrganizationSlug()}`,
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(hasSessionCookie(res.headers['set-cookie'])).toBe(false);
    expect(retry.status).toBe(200);
  });

  it('should reject self-serve Organization create after Sign-up', async () => {
    const session = await createVerifiedCustomerSession();
    const slug = uniqueOrganizationSlug();

    const created = await createOrganization(session, {
      name: `Workspace ${slug}`,
      slug,
    });

    expect(created.status).toBeGreaterThanOrEqual(400);
    expect(created.data.code).toBe(
      'YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION',
    );
  });

  it('should list exactly the Organization created at Sign-up', async () => {
    const organizationName = `Workspace ${uniqueOrganizationSlug()}`;
    const session = await createVerifiedCustomerSession({ organizationName });

    const listed = await listOrganizations(session);

    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([
      expect.objectContaining({ name: organizationName }),
    ]);
  });

  it('should set the Active Organization', async () => {
    const session = await createVerifiedCustomerSession();
    const listed = await listOrganizations(session);

    await setActiveOrganization(session, { organizationId: null });
    const unset = await getSession(session);
    const setActive = await setActiveOrganization(session, {
      organizationId: String(listed.data[0].id),
    });
    const current = await getSession(session);

    expect(unset.data.session.activeOrganizationId).toBeNull();
    expect(setActive.status).toBe(200);
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(listed.data[0].id),
    );
  });

  it('should unset the Active Organization', async () => {
    const session = await createVerifiedCustomerSession();

    const unset = await setActiveOrganization(session, {
      organizationId: null,
    });
    const current = await getSession(session);

    expect(unset.status).toBe(200);
    expect(current.data.session.activeOrganizationId).toBeNull();
  });

  it('should get the Active Organization and Membership', async () => {
    const organizationName = `Workspace ${uniqueOrganizationSlug()}`;
    const session = await createVerifiedCustomerSession({ organizationName });
    const listed = await listOrganizations(session);

    const active = await getFullOrganization(session);
    const membership = await getActiveMember(session);

    expect(active.status).toBe(200);
    expect(active.data.name).toBe(organizationName);
    expect(String(active.data.id)).toBe(String(listed.data[0].id));
    expect(membership.status).toBe(200);
    expect(membership.data.role).toBe('owner');
    expect(String(membership.data.organizationId)).toBe(
      String(listed.data[0].id),
    );
  });

  it('should set Active Organization on sign-in when the User has a Membership', async () => {
    const organizationName = `Workspace ${uniqueOrganizationSlug()}`;
    const session = await createVerifiedCustomerSession({ organizationName });
    const listed = await listOrganizations(session);

    await signOut(session);
    const signInRes = await signIn({
      email: session.email,
      password: session.password,
      origin: WEB_ORIGIN,
    });
    const signedIn = {
      cookie: cookieHeader(signInRes.headers['set-cookie']),
      origin: WEB_ORIGIN,
    };
    const current = await getSession(signedIn);
    const afterSignIn = await listOrganizations(signedIn);

    expect(signInRes.status).toBe(200);
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(listed.data[0].id),
    );
    expect(afterSignIn.data).toEqual([
      expect.objectContaining({ name: organizationName }),
    ]);
  });

  it('should reject Super Admin create-Organization via the plugin', async () => {
    const signInRes = await signIn({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      origin: ADMIN_ORIGIN,
    });
    const session = {
      cookie: cookieHeader(signInRes.headers['set-cookie']),
      origin: ADMIN_ORIGIN,
    };
    const slug = uniqueOrganizationSlug();

    const created = await createOrganization(session, {
      name: `Workspace ${slug}`,
      slug,
    });

    expect(signInRes.status).toBe(200);
    expect(created.status).toBeGreaterThanOrEqual(400);
    expect(created.data.code).toBe(
      'YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION',
    );
  });
});
