import { LandingLocale } from './enums';
import type { LandingMessages } from './interfaces';

const EN_MESSAGES: LandingMessages = {
  skipToContent: 'Skip to content',
  productTagline: 'Dispatch for residential HVAC and plumbing teams.',
  nav: [
    { label: 'Product', href: '#product' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Roles', href: '#roles' },
    { label: 'FAQ', href: '#faq' },
  ],
  footerLinks: [
    { label: 'Sign in', href: '/sign-in' },
    { label: 'Create organization', href: '/sign-up' },
    { label: 'Product', href: '#product' },
    { label: 'FAQ', href: '#faq' },
  ],
  actions: {
    signIn: 'Sign in',
    createOrganization: 'Create organization',
    createYourOrganization: 'Create your organization',
    seeHowItWorks: 'See how it works',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main',
    mobileNav: 'Mobile',
    footerNav: 'Footer',
    switchToEnglish: 'English',
    switchToArabic: 'العربية',
  },
  hero: {
    headline: 'Field dispatch without the WhatsApp fog.',
    supporting:
      'One board for intake, assign, field status, and customer notify hygiene.',
    boardCaption:
      'Dispatcher board · Jobs, urgency, status, and assignee in one place',
  },
  problem: {
    eyebrow: 'Before Flowdesk',
    title: 'The day still runs on calls, chats, and memory.',
    description:
      'Homeowners reach the office when HVAC or plumbing fails. Without a shared system, every handoff invents its own truth.',
    points: [
      {
        title: 'Incomplete intake',
        description:
          'Missing address, floor, phone, or equipment hint — the technician calls the office mid-route.',
      },
      {
        title: 'Unclear ownership',
        description:
          'Two people text two technicians, or nobody owns the job at all.',
      },
      {
        title: 'Status fog',
        description:
          'The office cannot tell whether a job is en route, on site, waiting, or done.',
      },
      {
        title: 'Customer left waiting',
        description:
          'Work finished or the technician moved, but the homeowner never heard.',
      },
      {
        title: 'Owner blind spot',
        description:
          'No single list of open, overdue, blocked, and done today.',
      },
    ],
  },
  workflow: {
    eyebrow: 'Workflow',
    title: 'One path from the call to done today.',
    description:
      'Flowdesk mirrors how residential HVAC and plumbing offices already work — then makes ownership, status, and notify hygiene explicit.',
    steps: [
      {
        step: '01',
        title: 'Intake',
        description:
          'Search the customer by phone, capture the service address, problem, service type, urgency, and preferred window before anyone assigns.',
      },
      {
        step: '02',
        title: 'Assign',
        description:
          'A dispatcher or owner picks an active technician using skill, coverage area, and today’s open job count. Skill mismatch warns; inactive techs are blocked.',
      },
      {
        step: '03',
        title: 'Field status',
        description:
          'The assignee walks Assigned → En route → On site → Completed, or marks Blocked with a required reason. Peer handoff is not allowed.',
      },
      {
        step: '04',
        title: 'Notify',
        description:
          'Customers and technicians get queued messages on key events. Failed sends stay visible so the office can resend or mark the customer informed.',
      },
      {
        step: '05',
        title: 'Owner view',
        description:
          'Open, overdue, blocked, and done today — in Africa/Cairo — with drill-down into any job.',
      },
    ],
  },
  showcase: {
    eyebrow: 'Product',
    title: 'See the system the office and field share.',
    description:
      'Realistic surfaces built from Flowdesk concepts — Jobs, status, assignees, notifications, and owner metrics.',
    items: [
      {
        id: 'assign',
        eyebrow: 'Assignment',
        title: 'Manual assign with the hints dispatchers already use.',
        description:
          'Flowdesk does not auto-dispatch. It surfaces skills, coverage tags, and workload so the person on the phone can decide.',
        points: [
          'Hard-block inactive technicians.',
          'Warn on skill mismatch without forcing a bad match.',
          'Reassign resets the new technician to Assigned and keeps history.',
        ],
        mock: 'assign',
      },
      {
        id: 'tech',
        eyebrow: 'Technician view',
        title:
          'Technicians only see their own jobs — and advance a clear status ladder.',
        description:
          'Field UI stays focused: what is mine today, where I am in the lifecycle, and what happens when work cannot finish.',
        points: [
          'Assigned → En route → On site → Completed.',
          'Blocked requires a reason; office handles reassignment.',
          'No org-wide board and no tech-to-tech assign.',
        ],
        mock: 'tech',
      },
      {
        id: 'owner',
        eyebrow: 'Owner dashboard',
        title: 'End-of-day clarity without a verbal roll call.',
        description:
          'Owners get operational counts for open, overdue, blocked, and completed today — then drill into the jobs behind each number.',
        points: [
          'Overdue respects preferred windows and ASAP/emergency rules.',
          'Cancelled stays separate from open and done.',
          'Overrides stay with Owner and Dispatcher, not the field ladder.',
        ],
        mock: 'owner',
      },
      {
        id: 'notify',
        eyebrow: 'Notifications',
        title: 'Outbound messages that do not disappear into a chat thread.',
        description:
          'When a job is assigned, customer and technician messages are queued with it. You can see pending, sent, or failed — and act when something fails.',
        points: [
          'Customers hear about Assigned, En route, On site, Completed, Cancelled, and reassign.',
          'Resend is a deliberate new message — not a silent duplicate.',
          'Mark Informed when the office already told the customer by phone or WhatsApp.',
        ],
        mock: 'notify',
      },
    ],
  },
  roles: {
    eyebrow: 'Roles',
    title: 'One Organization. Three seats that match the work.',
    description:
      'Owners run the company. Dispatchers run the board. Technicians run their own jobs. Customers stay callers — not product users.',
    items: [
      {
        id: 'owner',
        role: 'Owner',
        summary:
          'Runs the Organization: users, settings, overrides, and the operational dashboard.',
        capabilities: [
          'Public Sign-up creates the Organization and this seat',
          'Invite Dispatchers, Technicians, and additional Owners',
          'Archive customers; override complete or cancel when needed',
        ],
      },
      {
        id: 'dispatcher',
        role: 'Dispatcher',
        summary:
          'Takes intake, assigns and reassigns Jobs, monitors status, and keeps customer notify hygiene clean.',
        capabilities: [
          'Create customers and jobs with required intake fields',
          'Assign, reassign, and cancel with reasons',
          'Resend notifications or mark the customer informed',
        ],
      },
      {
        id: 'technician',
        role: 'Technician',
        summary:
          'Performs field work on Jobs assigned to them — status only on their own queue.',
        capabilities: [
          'See only their own jobs for the day',
          'Advance the status ladder or mark Blocked',
          'Cannot assign others or open the full org board',
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Straight answers from the product rules.',
    description:
      'No invented customers or SLAs — just what Flowdesk does in MVP.',
    items: [
      {
        question: 'Who is Flowdesk for?',
        answer:
          'Residential HVAC and plumbing Organizations with an office dispatcher, field technicians, and an owner who needs operational visibility. Customers do not log in — the office enters requests from calls and texts.',
      },
      {
        question: 'How does an Organization get started?',
        answer:
          'Public Sign-up on the web app creates a User, a new Organization, and the Owner seat together. After email verification, the Owner invites Dispatchers and Technicians. A User belongs to at most one Organization in MVP.',
      },
      {
        question: 'Does Flowdesk auto-dispatch technicians?',
        answer:
          'No. Assignment is manual. Flowdesk shows active status, HVAC/Plumbing skills, coverage area tags, and today’s open job count so the dispatcher can choose. Inactive technicians are blocked; skill mismatch warns.',
      },
      {
        question: 'What job statuses exist?',
        answer:
          'New, Assigned, En route, On site, Blocked, Completed, and Cancelled. Blocked and Cancelled require a reason. Technicians advance only their own jobs; reassignment returns the job to Assigned for the new technician.',
      },
      {
        question: 'How are customers notified?',
        answer:
          'Queued outbound notifications fire on Assigned, En route, On site, Completed, Cancelled, and reassign. Blocked does not auto-ping the customer. If delivery fails, the office can resend or mark the customer informed.',
      },
      {
        question: 'Is Arabic and English supported?',
        answer:
          'Yes. The UI switches AR | EN with RTL when Arabic is selected. Job notes stay as typed (mixed language is fine). Notification language follows the customer preference, defaulting to the Organization default.',
      },
      {
        question: 'What is deliberately out of MVP?',
        answer:
          'Quotes and invoicing, inventory, live GPS and route optimization, customer self-serve portal, recurring contracts, WhatsApp two-way inbox, and native mobile apps. Flowdesk stays an ops product for intake, assign, status, notify, and owner visibility.',
      },
    ],
  },
  cta: {
    title: 'Create your Organization and take the first call on a real board.',
    description:
      'Sign-up creates your User, Organization, and Owner seat. Invite Dispatchers and Technicians after email verification.',
  },
  mocks: {
    orgBadge: 'NileFix · Cairo',
    boardTitle: 'Today’s jobs',
    boardSubtitle: 'Dispatcher board · Wednesday 23 Sep',
    boardFilters: {
      all: 'All · 18',
      new: 'New · 3',
      enRoute: 'En route · 2',
      blocked: 'Blocked · 2',
    },
    table: {
      job: 'Job',
      customer: 'Customer',
      service: 'Service',
      urgency: 'Urgency',
      status: 'Status',
      assignee: 'Assignee',
      unassigned: 'Unassigned',
    },
    urgency: {
      Emergency: 'Emergency',
      'Same day': 'Same day',
      Scheduled: 'Scheduled',
    },
    status: {
      New: 'New',
      Assigned: 'Assigned',
      'En route': 'En route',
      'On site': 'On site',
      Blocked: 'Blocked',
      Completed: 'Completed',
      Cancelled: 'Cancelled',
      pending: 'pending',
      sent: 'sent',
      failed: 'failed',
    },
    events: {
      Assigned: 'Assigned',
      'En route': 'En route',
      Reassign: 'Reassign',
    },
    assignTitle: 'Assign technician',
    assignSubtitle: 'NF-1840 · Sara El Masry · HVAC · Zamalek',
    assignIntake:
      'Required intake complete · Preferred window Tomorrow 10:00 · Urgency Scheduled',
    inactive: 'Inactive',
    selected: 'Selected',
    openToday: 'today',
    assignHint:
      'Skill match for HVAC. Inactive technicians stay blocked from assign.',
    techTitle: 'My jobs',
    techSubtitle: 'Karim Nabil · Technician',
    waitingOnOffice: 'Waiting on office',
    markStatus: 'Mark',
    reasonPrefix: 'Reason:',
    ownerTitle: 'Operations today',
    ownerSubtitle: 'Owner dashboard · Africa/Cairo',
    needsAttention: 'Needs attention',
    metrics: {
      open: { label: 'Open', hint: 'New through Blocked' },
      overdue: { label: 'Overdue', hint: 'Window passed or ASAP > 2h' },
      blocked: { label: 'Blocked', hint: 'Needs office action' },
      doneToday: { label: 'Done today', hint: 'Completed · Africa/Cairo' },
    },
    attention: {
      blockedPart: 'Blocked · needs part',
      asapOpen: 'ASAP emergency · still open',
      windowEnded: 'Window ended · still Assigned',
    },
    notifyTitle: 'Notification hygiene',
    notifySubtitle: 'NF-1841 · Omar Farouk · reassign',
    notifyTable: {
      event: 'Event',
      recipient: 'Recipient',
      channel: 'Channel',
      delivery: 'Delivery',
    },
    resend: 'Resend to customer',
    markInformed: 'Mark Informed',
    notifyFooter: 'Failed delivery stays visible until the office acts.',
  },
};

const AR_MESSAGES: LandingMessages = {
  skipToContent: 'انتقل إلى المحتوى',
  productTagline: 'تنسيق طلبات الخدمة الميدانية لفرق التكييف والسباكة.',
  nav: [
    { label: 'المنتج', href: '#product' },
    { label: 'كيف يعمل', href: '#workflow' },
    { label: 'الأدوار', href: '#roles' },
    { label: 'الأسئلة', href: '#faq' },
  ],
  footerLinks: [
    { label: 'تسجيل الدخول', href: '/sign-in' },
    { label: 'ابدأ مؤسستك', href: '/sign-up' },
    { label: 'المنتج', href: '#product' },
    { label: 'الأسئلة', href: '#faq' },
  ],
  actions: {
    signIn: 'تسجيل الدخول',
    createOrganization: 'ابدأ مؤسستك',
    createYourOrganization: 'ابدأ مؤسستك',
    seeHowItWorks: 'شاهد كيف يعمل',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    mainNav: 'القائمة الرئيسية',
    mobileNav: 'قائمة الجوال',
    footerNav: 'تذييل الصفحة',
    switchToEnglish: 'English',
    switchToArabic: 'العربية',
  },
  hero: {
    headline: 'تنسيق ميداني… بلا فوضى واتساب.',
    supporting:
      'لوحة واحدة لاستقبال الطلب، تعيين الفني، متابعة الحالة، وإبقاء العميل على اطلاع.',
    boardCaption: 'لوحة التنسيق · الطلبات والأولوية والحالة والفني في مكان واحد',
  },
  problem: {
    eyebrow: 'قبل Flowdesk',
    title: 'اليوم ما زال يُدار بالمكالمات والدردشة والذاكرة.',
    description:
      'صاحب المنزل يتصل عندما يتعطل التكييف أو السباكة. من دون نظام مشترك، كل خطوة تنقل معلومة ناقصة.',
    points: [
      {
        title: 'طلب غير مكتمل',
        description:
          'ينقص العنوان أو الدور أو الهاتف أو وصف العطل — فيتصل الفني بالمكتب وهو في الطريق.',
      },
      {
        title: 'من المسؤول؟',
        description:
          'شخصان يرسلان لفنيين مختلفين، أو لا أحد يملك الطلب.',
      },
      {
        title: 'لا أحد يعرف أين وصل الطلب',
        description:
          'المكتب لا يرى إن كان الفني في الطريق أو في الموقع أو انتظر أو أنهى.',
      },
      {
        title: 'العميل ينتظر بلا خبر',
        description:
          'العمل انتهى أو تحرّك الفني… والعميل لم يُبلَّغ.',
      },
      {
        title: 'المدير بلا صورة واضحة',
        description:
          'لا قائمة واحدة للمفتوح والمتأخر والمتعذّر والمنجز اليوم.',
      },
    ],
  },
  workflow: {
    eyebrow: 'كيف يعمل',
    title: 'من المكالمة إلى إنجاز اليوم — في مسار واحد.',
    description:
      'Flowdesk يطابق طريقة عمل مكاتب التكييف والسباكة، ويوضح الملكية والحالة وتحديثات العميل.',
    steps: [
      {
        step: '01',
        title: 'استقبال الطلب',
        description:
          'ابحث عن العميل برقم الهاتف، ثم سجّل العنوان والعطل ونوع الخدمة والأولوية والوقت المفضل — قبل أي تعيين.',
      },
      {
        step: '02',
        title: 'تعيين الفني',
        description:
          'يختار المنسّق أو المدير فنياً نشطاً حسب المهارة ومنطقة التغطية وعدد طلباته اليوم. تحذير عند اختلاف المهارة، ومنع للفني غير النشط.',
      },
      {
        step: '03',
        title: 'تحديث الحالة',
        description:
          'يتقدّم الفني: معيَّن ← في الطريق ← في الموقع ← مكتمل، أو يضع الطلب متعذّراً مع سبب. لا تسليم بين الفنيين.',
      },
      {
        step: '04',
        title: 'تحديث العميل',
        description:
          'تُرسل رسائل للعميل والفني عند اللحظات المهمة. إن فشل الإرسال يبقى ظاهراً لإعادة المحاولة أو تسجيل أن العميل عُلم.',
      },
      {
        step: '05',
        title: 'لوحة المدير',
        description:
          'مفتوح، متأخر، متعذّر، ومنجز اليوم — بتوقيت القاهرة — مع الدخول لأي طلب.',
      },
    ],
  },
  showcase: {
    eyebrow: 'المنتج',
    title: 'شاهد كيف يعمل المكتب والميدان على نفس الصورة.',
    description:
      'واجهات حقيقية لمفاهيم Flowdesk: الطلبات، الحالة، الفني، الإشعارات، ولوحة المدير.',
    items: [
      {
        id: 'assign',
        eyebrow: 'التعيين',
        title: 'تعيين يدوي… بنفس المعلومات التي يعتمدها المنسّق.',
        description:
          'لا توزيع آلي. يعرض Flowdesk المهارة والتغطية وعبء اليوم ليقرّر من على الخط.',
        points: [
          'الفني غير النشط لا يُعيَّن.',
          'تحذير عند اختلاف المهارة — دون فرض اختيار خاطئ.',
          'عند إعادة التعيين يبدأ الفني الجديد من «معيَّن» مع الإبقاء على السجل.',
        ],
        mock: 'assign',
      },
      {
        id: 'tech',
        eyebrow: 'شاشة الفني',
        title: 'الفني يرى طلباته فقط — ويتقدّم بحالات واضحة.',
        description:
          'واجهة ميدانية مباشرة: ما المطلوب اليوم، أين وصلت، وما العمل إن تعذّر الإكمال.',
        points: [
          'معيَّن ← في الطريق ← في الموقع ← مكتمل.',
          'التعذّر يحتاج سبباً؛ المكتب يعيد التعيين.',
          'لا لوحة لكل المؤسسة، ولا تسليم بين الفنيين.',
        ],
        mock: 'tech',
      },
      {
        id: 'owner',
        eyebrow: 'لوحة المدير',
        title: 'صورة نهاية اليوم — بلا سؤال شفهي.',
        description:
          'أرقام المفتوح والمتأخر والمتعذّر والمنجز اليوم، ثم التفاصيل خلف كل رقم.',
        points: [
          'التأخر يحسب وفق النافذة الزمنية وقواعد الطارئ و«في أسرع وقت».',
          'الملغى منفصل عن المفتوح والمنجز.',
          'صلاحيات التجاوز للمدير والمنسّق — لا لخطوات الفني اليومية.',
        ],
        mock: 'owner',
      },
      {
        id: 'notify',
        eyebrow: 'التحديثات',
        title: 'رسائل واضحة… لا تضيع داخل دردشة.',
        description:
          'مع كل تعيين تُجهَّز رسائل العميل والفني. ترى: قيد الإرسال، أُرسلت، أو فشلت — وتتصرف فوراً.',
        points: [
          'يُبلَّغ العميل عند التعيين، في الطريق، في الموقع، الإكمال، الإلغاء، وإعادة التعيين.',
          'إعادة الإرسال رسالة جديدة مقصودة — وليست تكراراً صامتاً.',
          '«تم الإبلاغ» عندما أخبر المكتب العميل هاتفياً أو عبر واتساب.',
        ],
        mock: 'notify',
      },
    ],
  },
  roles: {
    eyebrow: 'الأدوار',
    title: 'مؤسسة واحدة. ثلاثة أدوار لكل مهمة.',
    description:
      'المدير يدير الشركة. المنسّق يدير اللوحة. الفني يدير طلباته. العملاء يتصلون — ولا يدخلون النظام.',
    items: [
      {
        id: 'owner',
        role: 'المدير',
        summary:
          'يشغّل المؤسسة: المستخدمون، الإعدادات، التجاوزات، ولوحة التشغيل.',
        capabilities: [
          'التسجيل ينشئ المؤسسة ويمنحك دور المدير',
          'ادعُ المنسّقين والفنيين ومديرين إضافيين',
          'أرشِف العملاء، وتجاوز الإكمال أو الإلغاء عند الحاجة',
        ],
      },
      {
        id: 'dispatcher',
        role: 'المنسّق',
        summary:
          'يستقبل الطلبات، يعيّن ويعيد التعيين، يتابع الحالة، ويتأكد أن العميل تبلّغ.',
        capabilities: [
          'أنشئ العملاء والطلبات بالحقول الأساسية',
          'عيّن، أعد التعيين، أو ألغِ مع ذكر السبب',
          'أعد إرسال التحديث أو سجّل أن العميل عُلم',
        ],
      },
      {
        id: 'technician',
        role: 'الفني',
        summary:
          'ينفّذ العمل الميداني على طلباته فقط — ويحدّث حالتها من جهازه.',
        capabilities: [
          'يرى طلباته لليوم فقط',
          'يتقدّم في الحالات أو يضع الطلب متعذّراً',
          'لا يعيّن غيره ولا يفتح لوحة المؤسسة',
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'الأسئلة',
    title: 'إجابات مباشرة. بلا مبالغة.',
    description:
      'ما يفعله Flowdesk فعلاً في النسخة الأولى — بلا عملاء أو أرقام مختلقة.',
    items: [
      {
        question: 'لمن Flowdesk؟',
        answer:
          'لفرق التكييف والسباكة السكنية: منسّق في المكتب، فنيون في الميدان، ومدير يحتاج صورة تشغيل واضحة. العملاء لا يسجّلون — المكتب يدخل الطلب من المكالمة أو الرسالة.',
      },
      {
        question: 'كيف أبدأ؟',
        answer:
          'التسجيل ينشئ حسابك ومؤسستك ودور المدير معاً. بعد تأكيد البريد تدعو المنسّقين والفنيين. في النسخة الأولى ينتمي المستخدم لمؤسسة واحدة فقط.',
      },
      {
        question: 'هل يختار النظام الفني تلقائياً؟',
        answer:
          'لا. التعيين يدوي. يعرض Flowdesk النشاط ومهارات التكييف/السباكة ومناطق التغطية وعدد الطلبات المفتوحة اليوم. الفني غير النشط ممنوع، واختلاف المهارة يعطي تحذيراً فقط.',
      },
      {
        question: 'ما حالات الطلب؟',
        answer:
          'جديد، معيَّن، في الطريق، في الموقع، متعذّر، مكتمل، وملغى. المتعذّر والملغى يحتاجان سبباً. الفني يحدّث طلباته فقط، وإعادة التعيين تعيد الطلب إلى «معيَّن» للفني الجديد.',
      },
      {
        question: 'كيف يُبلَّغ العميل؟',
        answer:
          'تُرسل تحديثات عند التعيين، في الطريق، في الموقع، الإكمال، الإلغاء، وإعادة التعيين. التعذّر لا يرسل للعميل تلقائياً. عند فشل الإرسال يمكنك إعادة المحاولة أو تسجيل أن العميل عُلم.',
      },
      {
        question: 'هل العربية والإنجليزية مدعومتان؟',
        answer:
          'نعم. الواجهة تتبدل بين العربية والإنجليزية، مع اتجاه من اليمين لليسار بالعربية. ملاحظات الطلب تُحفظ كما كُتبت. لغة الرسالة تتبع تفضيل العميل، أو افتراضي المؤسسة.',
      },
      {
        question: 'ما خارج النسخة الأولى؟',
        answer:
          'الفوترة، المخزون، التتبع الحي وتحسين المسارات، بوابة العميل، العقود الدورية، محادثة واتساب ثنائية، وتطبيقات الجوال. Flowdesk يركز على الاستقبال، التعيين، الحالة، التحديث، ورؤية المدير.',
      },
    ],
  },
  cta: {
    title: 'ابدأ مؤسستك… واستقبل أول مكالمة على لوحة حقيقية.',
    description:
      'التسجيل ينشئ حسابك ومؤسستك ودور المدير. ادعُ فريقك بعد تأكيد البريد.',
  },
  mocks: {
    orgBadge: 'نايل فيكس · القاهرة',
    boardTitle: 'طلبات اليوم',
    boardSubtitle: 'لوحة التنسيق · الأربعاء ٢٣ سبتمبر',
    boardFilters: {
      all: 'الكل · ١٨',
      new: 'جديد · ٣',
      enRoute: 'في الطريق · ٢',
      blocked: 'متعذّر · ٢',
    },
    table: {
      job: 'الطلب',
      customer: 'العميل',
      service: 'الخدمة',
      urgency: 'الأولوية',
      status: 'الحالة',
      assignee: 'الفني',
      unassigned: 'غير معيَّن',
    },
    urgency: {
      Emergency: 'طارئ',
      'Same day': 'اليوم',
      Scheduled: 'مجدول',
    },
    status: {
      New: 'جديد',
      Assigned: 'معيَّن',
      'En route': 'في الطريق',
      'On site': 'في الموقع',
      Blocked: 'متعذّر',
      Completed: 'مكتمل',
      Cancelled: 'ملغى',
      pending: 'قيد الإرسال',
      sent: 'أُرسلت',
      failed: 'فشل',
    },
    events: {
      Assigned: 'تعيين',
      'En route': 'في الطريق',
      Reassign: 'إعادة تعيين',
    },
    assignTitle: 'تعيين فني',
    assignSubtitle: 'NF-1840 · سارة المصري · تكييف · الزمالك',
    assignIntake: 'اكتملت بيانات الطلب · غداً ١٠:٠٠ · أولوية: مجدول',
    inactive: 'غير نشط',
    selected: 'محدد',
    openToday: 'اليوم',
    assignHint: 'المهارة مناسبة للتكييف. الفنيون غير النشطين لا يُعيَّنون.',
    techTitle: 'طلباتي',
    techSubtitle: 'كريم نبيل · فني',
    waitingOnOffice: 'بانتظار المكتب',
    markStatus: 'حدّث إلى',
    reasonPrefix: 'السبب:',
    ownerTitle: 'تشغيل اليوم',
    ownerSubtitle: 'لوحة المدير · توقيت القاهرة',
    needsAttention: 'يحتاج متابعة',
    metrics: {
      open: { label: 'مفتوح', hint: 'من جديد حتى متعذّر' },
      overdue: { label: 'متأخر', hint: 'انتهت النافذة أو طارئ > ساعتين' },
      blocked: { label: 'متعذّر', hint: 'يحتاج إجراء من المكتب' },
      doneToday: { label: 'منجز اليوم', hint: 'مكتمل · توقيت القاهرة' },
    },
    attention: {
      blockedPart: 'متعذّر · يحتاج قطعة',
      asapOpen: 'طارئ · ما زال مفتوحاً',
      windowEnded: 'انتهت النافذة · ما زال معيَّناً',
    },
    notifyTitle: 'متابعة التحديثات',
    notifySubtitle: 'NF-1841 · عمر فاروق · إعادة تعيين',
    notifyTable: {
      event: 'الحدث',
      recipient: 'المستلم',
      channel: 'القناة',
      delivery: 'الإرسال',
    },
    resend: 'أعد الإرسال للعميل',
    markInformed: 'تم الإبلاغ',
    notifyFooter: 'فشل الإرسال يبقى ظاهراً حتى يتابع المكتب.',
  },
};

export const LANDING_MESSAGES: Record<LandingLocale, LandingMessages> = {
  [LandingLocale.En]: EN_MESSAGES,
  [LandingLocale.Ar]: AR_MESSAGES,
};

export const LANDING_LOCALE_STORAGE_KEY = 'flowdesk.landing.locale';
