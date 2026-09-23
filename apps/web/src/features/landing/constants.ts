import {
  Headset,
  LayoutDashboard,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const PRODUCT_NAME = 'Flowdesk';

/** Aligns with auth app routes — kept local so landing does not import the auth barrel. */
export const LANDING_AUTH_HREFS = {
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

export const LANDING_ROLE_ICONS: Record<
  'owner' | 'dispatcher' | 'technician',
  LucideIcon
> = {
  owner: LayoutDashboard,
  dispatcher: Headset,
  technician: Wrench,
};

export interface MockJobRow {
  id: string;
  customer: string;
  service: 'HVAC' | 'Plumbing';
  area: string;
  urgency: 'Emergency' | 'Same day' | 'Scheduled';
  status: 'New' | 'Assigned' | 'En route' | 'On site' | 'Blocked' | 'Completed';
  assignee: string | null;
  window: string;
}

export const MOCK_BOARD_JOBS: MockJobRow[] = [
  {
    id: 'NF-1842',
    customer: 'Mona Hassan',
    service: 'HVAC',
    area: 'Maadi',
    urgency: 'Emergency',
    status: 'En route',
    assignee: 'Karim N.',
    window: 'ASAP',
  },
  {
    id: 'NF-1841',
    customer: 'Omar Farouk',
    service: 'Plumbing',
    area: 'Nasr City',
    urgency: 'Same day',
    status: 'Assigned',
    assignee: 'Youssef A.',
    window: '14:00–16:00',
  },
  {
    id: 'NF-1840',
    customer: 'Sara El Masry',
    service: 'HVAC',
    area: 'Zamalek',
    urgency: 'Scheduled',
    status: 'New',
    assignee: null,
    window: 'Tomorrow 10:00',
  },
  {
    id: 'NF-1838',
    customer: 'Hany Kamel',
    service: 'Plumbing',
    area: 'Heliopolis',
    urgency: 'Same day',
    status: 'Blocked',
    assignee: 'Karim N.',
    window: '11:00–13:00',
  },
  {
    id: 'NF-1835',
    customer: 'Laila Mansour',
    service: 'HVAC',
    area: 'New Cairo',
    urgency: 'Scheduled',
    status: 'On site',
    assignee: 'Nour S.',
    window: '09:00–11:00',
  },
];

export interface MockTechnician {
  name: string;
  skills: string;
  area: string;
  openJobs: number;
  active: boolean;
}

export const MOCK_TECHNICIANS: MockTechnician[] = [
  {
    name: 'Karim Nabil',
    skills: 'HVAC · Plumbing',
    area: 'Maadi, Mokattam',
    openJobs: 3,
    active: true,
  },
  {
    name: 'Youssef Adel',
    skills: 'Plumbing',
    area: 'Nasr City, Heliopolis',
    openJobs: 2,
    active: true,
  },
  {
    name: 'Nour Saleh',
    skills: 'HVAC',
    area: 'New Cairo, Rehab',
    openJobs: 1,
    active: true,
  },
  {
    name: 'Tarek Mostafa',
    skills: 'Plumbing',
    area: '6th October',
    openJobs: 0,
    active: false,
  },
];

export interface MockNotifyRow {
  event: 'Assigned' | 'En route' | 'Reassign';
  recipient: string;
  channel: string;
  status: 'pending' | 'sent' | 'failed';
}

export const MOCK_NOTIFY_ROWS: MockNotifyRow[] = [
  {
    event: 'Assigned',
    recipient: 'Mona Hassan',
    channel: 'SMS · AR',
    status: 'sent',
  },
  {
    event: 'En route',
    recipient: 'Mona Hassan',
    channel: 'SMS · AR',
    status: 'pending',
  },
  {
    event: 'Assigned',
    recipient: 'Karim Nabil',
    channel: 'SMS · EN',
    status: 'sent',
  },
  {
    event: 'Reassign',
    recipient: 'Omar Farouk',
    channel: 'SMS · AR',
    status: 'failed',
  },
];
