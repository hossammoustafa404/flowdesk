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
  it('should create a User on Sign-up and leave the Session without an Organization', async () => {
    const email = uniqueCustomerEmail();

    const signedUp = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      organizationName: 'Ignored Organization',
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
    const current = await getSession(session);

    expect(signInRes.status).toBe(200);
    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([]);
    expect(current.data.session.activeOrganizationId).toBeNull();
    expect(membership.status).toBeGreaterThanOrEqual(400);
    expect(membership.data.code).toBe('NO_ACTIVE_ORGANIZATION');
  });

  it('should reject Sign-up when the password is too short without creating a User', async () => {
    const email = uniqueCustomerEmail();

    const res = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
      password: 'short',
    });
    const retry = await signUpCustomer({
      origin: WEB_ORIGIN,
      email,
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(hasSessionCookie(res.headers['set-cookie'])).toBe(false);
    expect(retry.status).toBe(200);
  });

  it('should create an Organization by name, assign Owner, derive a unique slug, and make it Active', async () => {
    const suffix = uniqueOrganizationSlug();
    const name = `Acme ${suffix}`;
    const session = await createVerifiedCustomerSession({
      organizationName: null,
    });

    const created = await createOrganization(session, { name });
    const listed = await listOrganizations(session);
    const membership = await getActiveMember(session);
    const current = await getSession(session);

    expect(created.status).toBe(200);
    expect(created.data.name).toBe(name);
    expect(created.data.slug).toBe(`acme-${suffix}`);
    expect(membership.status).toBe(200);
    expect(membership.data.role).toBe('owner');
    expect(String(membership.data.organizationId)).toBe(
      String(created.data.id),
    );
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(created.data.id),
    );
    expect(listed.data).toEqual([
      expect.objectContaining({ name, slug: `acme-${suffix}` }),
    ]);
  });

  it('should derive a different slug when that name is already used', async () => {
    const suffix = uniqueOrganizationSlug();
    const name = `Acme ${suffix}`;
    const first = await createVerifiedCustomerSession({
      organizationName: null,
    });
    const second = await createVerifiedCustomerSession({
      organizationName: null,
    });

    const firstCreated = await createOrganization(first, { name });
    const secondCreated = await createOrganization(second, { name });

    expect(firstCreated.status).toBe(200);
    expect(secondCreated.status).toBe(200);
    expect(firstCreated.data.slug).toBe(`acme-${suffix}`);
    expect(secondCreated.data.slug).toBe(`acme-${suffix}-1`);
  });

  it('should let a User with a seat create another Organization and keep the earlier seat', async () => {
    const firstSuffix = uniqueOrganizationSlug();
    const secondSuffix = uniqueOrganizationSlug();
    const firstName = `Acme ${firstSuffix}`;
    const secondName = `Beacon ${secondSuffix}`;
    const session = await createVerifiedCustomerSession({
      organizationName: null,
    });
    const firstCreated = await createOrganization(session, { name: firstName });

    const created = await createOrganization(session, { name: secondName });
    const current = await getSession(session);
    const active = await getActiveMember(session);
    const listed = await listOrganizations(session);
    await setActiveOrganization(session, {
      organizationId: String(firstCreated.data.id),
    });
    const earlier = await getActiveMember(session);

    expect(created.status).toBe(200);
    expect(created.data.slug).toBe(`beacon-${secondSuffix}`);
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(created.data.id),
    );
    expect(active.status).toBe(200);
    expect(active.data.role).toBe('owner');
    expect(String(active.data.organizationId)).toBe(String(created.data.id));
    expect(listed.status).toBe(200);
    expect(listed.data).toHaveLength(2);
    expect(earlier.status).toBe(200);
    expect(earlier.data.role).toBe('owner');
    expect(String(earlier.data.organizationId)).toBe(
      String(firstCreated.data.id),
    );
  });

  it('should reject an invalid Organization name without creating one', async () => {
    const session = await createVerifiedCustomerSession({
      organizationName: null,
    });

    const created = await createOrganization(session, {
      name: 'x'.repeat(101),
    });
    const listed = await listOrganizations(session);

    expect(created.status).toBeGreaterThanOrEqual(400);
    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([]);
  });

  it('should list the Organization the User created', async () => {
    const suffix = uniqueOrganizationSlug();
    const organizationName = `Acme ${suffix}`;
    const session = await createVerifiedCustomerSession({ organizationName });

    const listed = await listOrganizations(session);

    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([
      expect.objectContaining({
        name: organizationName,
        slug: `acme-${suffix}`,
      }),
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
    const suffix = uniqueOrganizationSlug();
    const organizationName = `Acme ${suffix}`;
    const session = await createVerifiedCustomerSession({ organizationName });
    const listed = await listOrganizations(session);

    const active = await getFullOrganization(session);
    const membership = await getActiveMember(session);

    expect(active.status).toBe(200);
    expect(active.data.name).toBe(organizationName);
    expect(active.data.slug).toBe(`acme-${suffix}`);
    expect(String(active.data.id)).toBe(String(listed.data[0].id));
    expect(membership.status).toBe(200);
    expect(membership.data.role).toBe('owner');
    expect(String(membership.data.organizationId)).toBe(
      String(listed.data[0].id),
    );
  });

  it('should restore the last Active Organization on the next Session', async () => {
    const firstSuffix = uniqueOrganizationSlug();
    const secondSuffix = uniqueOrganizationSlug();
    const session = await createVerifiedCustomerSession({
      organizationName: null,
    });
    await createOrganization(session, { name: `Acme ${firstSuffix}` });
    const secondCreated = await createOrganization(session, {
      name: `Beacon ${secondSuffix}`,
    });

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

    expect(signInRes.status).toBe(200);
    expect(String(current.data.session.activeOrganizationId)).toBe(
      String(secondCreated.data.id),
    );
  });

  it('should set Active Organization on sign-in when the User has a Membership', async () => {
    const organizationName = `Acme ${uniqueOrganizationSlug()}`;
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

  it('should reject Super Admin create on the web app without granting a seat', async () => {
    const signInRes = await signIn({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      origin: ADMIN_ORIGIN,
    });
    const session = {
      cookie: cookieHeader(signInRes.headers['set-cookie']),
      origin: WEB_ORIGIN,
    };

    const created = await createOrganization(session, {
      name: `Workspace ${uniqueOrganizationSlug()}`,
    });
    const listed = await listOrganizations(session);

    expect(signInRes.status).toBe(200);
    expect(created.status).toBeGreaterThanOrEqual(400);
    expect(created.data.code).toBe(
      'YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION',
    );
    expect(listed.status).toBe(200);
    expect(listed.data).toEqual([]);
  });
});
