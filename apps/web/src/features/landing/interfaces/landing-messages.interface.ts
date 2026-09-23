export interface LandingNavLinkMessage {
  label: string;
  href: string;
}

export interface LandingPainPointMessage {
  title: string;
  description: string;
}

export interface LandingWorkflowStepMessage {
  step: string;
  title: string;
  description: string;
}

export interface LandingShowcaseMessage {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  mock: 'assign' | 'tech' | 'owner' | 'notify';
}

export interface LandingRoleMessage {
  id: 'owner' | 'dispatcher' | 'technician';
  role: string;
  summary: string;
  capabilities: string[];
}

export interface LandingFaqMessage {
  question: string;
  answer: string;
}

export interface LandingMessages {
  skipToContent: string;
  productTagline: string;
  nav: LandingNavLinkMessage[];
  footerLinks: LandingNavLinkMessage[];
  actions: {
    signIn: string;
    createOrganization: string;
    createYourOrganization: string;
    seeHowItWorks: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    mobileNav: string;
    footerNav: string;
    switchToEnglish: string;
    switchToArabic: string;
  };
  hero: {
    headline: string;
    supporting: string;
    boardCaption: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    description: string;
    points: LandingPainPointMessage[];
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    steps: LandingWorkflowStepMessage[];
  };
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    items: LandingShowcaseMessage[];
  };
  roles: {
    eyebrow: string;
    title: string;
    description: string;
    items: LandingRoleMessage[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: LandingFaqMessage[];
  };
  cta: {
    title: string;
    description: string;
  };
  mocks: {
    orgBadge: string;
    boardTitle: string;
    boardSubtitle: string;
    boardFilters: { all: string; new: string; enRoute: string; blocked: string };
    table: {
      job: string;
      customer: string;
      service: string;
      urgency: string;
      status: string;
      assignee: string;
      unassigned: string;
    };
    urgency: {
      Emergency: string;
      'Same day': string;
      Scheduled: string;
    };
    status: {
      New: string;
      Assigned: string;
      'En route': string;
      'On site': string;
      Blocked: string;
      Completed: string;
      Cancelled: string;
      pending: string;
      sent: string;
      failed: string;
    };
    events: {
      Assigned: string;
      'En route': string;
      Reassign: string;
    };
    assignTitle: string;
    assignSubtitle: string;
    assignIntake: string;
    inactive: string;
    selected: string;
    openToday: string;
    assignHint: string;
    techTitle: string;
    techSubtitle: string;
    waitingOnOffice: string;
    markStatus: string;
    reasonPrefix: string;
    ownerTitle: string;
    ownerSubtitle: string;
    needsAttention: string;
    metrics: {
      open: { label: string; hint: string };
      overdue: { label: string; hint: string };
      blocked: { label: string; hint: string };
      doneToday: { label: string; hint: string };
    };
    attention: {
      blockedPart: string;
      asapOpen: string;
      windowEnded: string;
    };
    notifyTitle: string;
    notifySubtitle: string;
    notifyTable: {
      event: string;
      recipient: string;
      channel: string;
      delivery: string;
    };
    resend: string;
    markInformed: string;
    notifyFooter: string;
  };
}
