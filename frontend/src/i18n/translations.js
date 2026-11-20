// All user-facing copy for the public site, in English and Persian (Farsi).
// The wording deliberately describes the product as a dedicated static IP
// address service and avoids network-privacy jargon.

export const en = {
  meta: {
    title: 'ZivaStatic — Dedicated Static IP Address',
    description:
      'Get your own dedicated static IP address in the country of your choice. Fixed, permanent, never shared — ready within minutes.',
  },
  langName: 'EN',
  switchTo: 'فارسی',

  nav: {
    dashboard: 'Dashboard',
    logout: 'Logout',
    signIn: 'Sign In',
    getStarted: 'Get Started',
  },

  common: {
    perMonth: 'per month',
    month: '/ month',
    cancelAnytime: 'Cancel anytime',
    loading: 'Loading...',
    copy: 'Copy',
    copied: 'Copied',
    price: '$9.99',
  },

  status: {
    provisioning: 'Setting up',
    active: 'Active',
    error: 'Error',
  },

  landing: {
    badge: 'Set up automatically — no waiting, no tickets',
    heroLine1: 'Your Own',
    heroLine2: 'Static IP Address',
    heroP1:
      'A dedicated IP address in the country you choose. Fixed, permanent and yours alone — it never changes and is never shared with anyone else.',
    heroP2:
      'Built for businesses, developers, remote teams, online stores and anyone who needs one reliable, recognisable address on the internet.',
    ctaPrimary: 'Get Your Static IP',
    ctaSecondary: 'Create Account',
    trust: [
      'Never shared with other users',
      'Live in under 10 minutes',
      'Locations in 4 countries',
    ],

    featuresTitle: 'What you get',
    featuresSub:
      'A complete dedicated-IP service. Everything is prepared for you — there is nothing to configure by hand.',
    features: [
      {
        title: 'A Truly Dedicated IP',
        desc: 'Your IP address belongs only to you. Nobody else shares it, and it never rotates or gets reassigned while your subscription is active.',
      },
      {
        title: 'Choose Your Country',
        desc: 'Pick where your address is located: datacenters in Germany, Finland, Singapore and the United States.',
      },
      {
        title: 'Ready in Minutes',
        desc: 'Your dedicated server is created automatically as soon as your order is confirmed. No manual steps and no support tickets.',
      },
      {
        title: '4 Ready-made Profiles',
        desc: 'Four connection profiles are prepared for every IP, so you can use it from phones, laptops and servers. Just download and import.',
      },
      {
        title: 'Your Own Server',
        desc: 'This is not a shared pool. You get a real dedicated cloud server — no crowded addresses, no inherited bad reputation, no throttling.',
      },
      {
        title: 'Always Available',
        desc: 'Your server runs 24/7 and restarts automatically if anything goes wrong, so your address is there whenever you need it.',
      },
    ],

    useCasesTitle: 'Who needs a static IP?',
    useCasesSub:
      'Anyone who needs a consistent, reliable identity on the internet — for work, for security, or for access.',
    useCases: [
      {
        title: 'Business & Whitelisting',
        desc: 'Add one fixed address to the allow-list of your payment gateway, bank panel, CRM or ERP. Your whole team is recognised from the same IP wherever they work.',
      },
      {
        title: 'Secure Administration',
        desc: 'Lock servers, databases and admin panels so only your dedicated IP can reach them. A simple, effective extra layer of protection.',
      },
      {
        title: 'Remote Teams',
        desc: 'Give distributed staff and contractors one shared, predictable address — like an office network that follows people around.',
      },
      {
        title: 'Developers & DevOps',
        desc: 'Use a stable outgoing address for API allow-lists, webhooks, CI/CD pipelines, staging environments and third-party integrations.',
      },
      {
        title: 'Online Stores & Marketing',
        desc: 'Manage storefronts, marketplace and advertising accounts from one consistent address, so constantly changing IPs never trigger security checks.',
      },
      {
        title: 'Freelancers & International Work',
        desc: 'Many client systems and platforms only accept connections from a known address or region. Get one that stays the same.',
      },
      {
        title: 'Regional Testing',
        desc: 'See how your website, app or ads appear from Germany, Finland, Singapore or the US before your customers do.',
      },
      {
        title: 'Control & Consistency',
        desc: 'Your traffic leaves through a server that only you use. No neighbours, no shared reputation, no surprises.',
      },
    ],

    stepsTitle: 'How it works',
    stepsSub: 'From order to ready in four simple steps.',
    steps: [
      { title: 'Pick a location', desc: 'Choose the country where your IP address should be.' },
      { title: 'Complete payment', desc: 'Secure checkout with a monthly subscription. Cancel any time.' },
      { title: 'Server is prepared', desc: 'Your dedicated server is created and configured automatically within minutes.' },
      { title: 'Download & use', desc: 'Download your profile from the dashboard and import it on any device.' },
    ],

    pricingTitle: 'One plan, everything included',
    pricingSub: 'No tiers, no upsells, no surprises.',
    pricingNote: 'Per dedicated IP. Cancel anytime.',
    pricingFeatures: [
      'Dedicated server — yours alone',
      'Fixed static IP address',
      'Your choice of country',
      '4 ready-to-use profiles with QR codes',
      'Available 24/7 with automatic restarts',
      'Cancel anytime',
    ],
    pricingFooter: 'Secure checkout · Fast setup · Cancel anytime',

    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        q: 'What exactly is a static IP address?',
        a: 'An IP address is your identity on the internet. Home and mobile connections normally get a different address every so often. A static IP is fixed — it stays exactly the same every time — which makes it reliable for allow-lists, remote access and consistent online identity.',
      },
      {
        q: 'What is the difference between a dedicated and a shared IP?',
        a: 'A shared address is used by many people at once, so you inherit everyone else’s behaviour and may get blocked or challenged because of it. A dedicated IP is used by you only. It is yours for as long as your subscription is active.',
      },
      {
        q: 'What do I receive after paying?',
        a: 'A real dedicated server in the country you picked, with its own fixed IP address. In your dashboard you can download four ready-made profiles (and scan them as QR codes) to start using the address on your devices.',
      },
      {
        q: 'How long does setup take?',
        a: 'Normally 5–10 minutes after payment. Everything is automatic. The dashboard updates by itself and shows your IP address as soon as it is ready.',
      },
      {
        q: 'Which devices can I use it on?',
        a: 'Windows, macOS, Linux, Android and iOS, as well as servers. Download the profile that suits your device — the dashboard tells you which file type each profile is.',
      },
      {
        q: 'Which profile should I choose?',
        a: 'Start with the “Fast profile” for the best speed, or the “Universal profile” for the widest compatibility. The “Native profile” works with the built-in settings of many phones and computers, and the “Flexible profile” is meant for advanced clients.',
      },
      {
        q: 'Can my whole team use the same IP?',
        a: 'Yes. You can share your profiles with your colleagues so that everyone appears from the same dedicated address. This is ideal for allow-lists in business tools.',
      },
      {
        q: 'Can I choose or change the country?',
        a: 'You choose the country when you order. If you need a different country later, order a new IP in that location — you can keep as many as you like.',
      },
      {
        q: 'What happens if I cancel?',
        a: 'Your server and IP address are released at the end of the billing period. You can order again at any time, but we cannot guarantee you will receive the same address.',
      },
      {
        q: 'How do I get help?',
        a: 'Write to support@zivastatic.com and include the Server ID shown on your IP’s detail page. We will get back to you as soon as possible.',
      },
    ],

    ctaTitle: 'Ready for your own static IP?',
    ctaSub: 'Pick a location, complete your order, and your dedicated address is ready within minutes.',
    ctaButton: 'Get Started Now',

    footerOrder: 'Order',
    footerLogin: 'Login',
    footerRegister: 'Register',
    rights: 'All rights reserved.',
  },

  auth: {
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginTitle: 'Welcome back',
    loginSub: 'Sign in to manage your static IPs',
    loginButton: 'Sign In',
    loginLoading: 'Signing in...',
    loginError: 'Incorrect email or password.',
    noAccount: 'Don’t have an account?',
    createFree: 'Create one free',
    registerTitle: 'Create your account',
    registerSub: 'Get your static IP address in minutes',
    perks: [
      'Your own dedicated IP address',
      '4 ready-made profiles included',
      'Ready within 10 minutes of ordering',
    ],
    registerButton: 'Create Account',
    registerLoading: 'Creating account...',
    registerError: 'Registration failed. Please try again.',
    passwordMismatch: 'Passwords do not match.',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
  },

  order: {
    title: 'Choose Your IP Location',
    sub: 'Select the country where your dedicated IP address should be based. Your server will be prepared there automatically.',
    steps: ['Pick location', 'Complete order', 'Server is prepared', 'Download & use'],
    available: 'Available Locations',
    locationsCount: (n) => `${n} locations`,
    loadingLocations: 'Loading locations...',
    loadError: 'Failed to load locations. Please refresh.',
    summary: 'Order Summary',
    selectedLocation: 'Selected location',
    selectLocation: 'Select a location',
    included: [
      'Dedicated server for your IP only',
      '4 ready-made profiles included',
      'Available 24/7',
      'Cancel anytime',
    ],
    monthlyTotal: 'Monthly total',
    processing: 'Processing...',
    continue: 'Continue to Payment',
    live: 'Your IP will be ready within 10 minutes',
    checkoutError: 'Failed to start checkout. Please try again.',
  },

  dashboard: {
    title: 'My Static IPs',
    newIp: 'New IP',
    total: 'Total IPs',
    active: 'Active',
    provisioning: 'Setting up',
    loadError: 'Failed to load your IPs.',
    loading: 'Loading your IPs...',
    emptyTitle: 'No static IPs yet',
    emptySub: 'Order your first dedicated static IP address. It will be ready automatically within minutes.',
    emptyButton: 'Get Your First Static IP',
  },

  card: {
    ipAddress: 'IP Address',
    assigning: 'Assigning...',
    manage: 'Manage IP',
  },

  detail: {
    back: 'Back to Dashboard',
    title: 'Your Static IP',
    ipAddress: 'IP Address',
    beingAssigned: 'Being assigned...',
    serverId: 'Server ID',
    location: 'Location',
    created: 'Created',
    notFound: 'Not found',
    notFoundText: 'This IP does not exist or you do not have access.',
    loadError: 'Failed to load IP details.',
    settingUpTitle: 'Setting up your server',
    settingUpText:
      'Your dedicated server is being created and your profiles are being prepared. This takes around 5–10 minutes and the page updates automatically.',
    profilesTitle: 'Connection Profiles',
    profilesHint: 'Download and use on any device',
    finalizing: 'Your profiles are being finalized. Please refresh in a moment.',
    howTitle: 'How to use',
    howText:
      'Download the profile that suits your device and import it into a compatible app or your device’s built-in network settings. Once it is active, your traffic leaves through your dedicated IP address:',
    errorTitle: 'Setup failed',
    errorText: 'There was a problem preparing your server. Please contact support and include your Server ID.',
  },

  profiles: {
    download: 'Download',
    qr: 'QR Code',
    downloadError: 'Failed to download the profile. Please try again.',
    openvpn: { name: 'Universal profile', desc: 'Profile file · works on most devices' },
    wireguard: { name: 'Fast profile', desc: 'Profile file · lightweight and quick' },
    ikev2: { name: 'Native profile', desc: 'Certificate file · built into many devices' },
    v2ray: { name: 'Flexible profile', desc: 'Profile file · for advanced clients' },
  },

  locations: {
    cities: {},
    countries: {},
  },
}

export const fa = {
  meta: {
    title: 'زیوا استاتیک — آی‌پی ثابت اختصاصی',
    description:
      'آی‌پی ثابت اختصاصی خودتان را در کشور دلخواه بگیرید. ثابت، دائمی و بدون اشتراک با دیگران — آماده در چند دقیقه.',
  },
  langName: 'FA',
  switchTo: 'English',

  nav: {
    dashboard: 'داشبورد',
    logout: 'خروج',
    signIn: 'ورود',
    getStarted: 'شروع کنید',
  },

  common: {
    perMonth: 'در ماه',
    month: '/ ماه',
    cancelAnytime: 'لغو در هر زمان',
    loading: 'در حال بارگذاری...',
    copy: 'کپی',
    copied: 'کپی شد',
    price: '۹٫۹۹ دلار',
  },

  status: {
    provisioning: 'در حال راه‌اندازی',
    active: 'فعال',
    error: 'خطا',
  },

  landing: {
    badge: 'راه‌اندازی خودکار — بدون انتظار و بدون تیکت',
    heroLine1: 'آی‌پی ثابت',
    heroLine2: 'مخصوص خودتان',
    heroP1:
      'یک آی‌پی اختصاصی در کشوری که خودتان انتخاب می‌کنید. ثابت، دائمی و فقط برای شما؛ هرگز تغییر نمی‌کند و با هیچ‌کس به اشتراک گذاشته نمی‌شود.',
    heroP2:
      'مناسب کسب‌وکارها، توسعه‌دهندگان، تیم‌های دورکار، فروشگاه‌های اینترنتی و هر کسی که به یک نشانی پایدار و قابل‌اعتماد در اینترنت نیاز دارد.',
    ctaPrimary: 'آی‌پی ثابت بگیرید',
    ctaSecondary: 'ساخت حساب کاربری',
    trust: [
      'هرگز با کاربران دیگر مشترک نیست',
      'آماده در کمتر از ۱۰ دقیقه',
      'لوکیشن در ۴ کشور',
    ],

    featuresTitle: 'چه چیزی دریافت می‌کنید',
    featuresSub:
      'یک سرویس کامل آی‌پی اختصاصی. همه‌چیز از قبل برایتان آماده می‌شود و نیازی به تنظیم دستی نیست.',
    features: [
      {
        title: 'آی‌پی واقعاً اختصاصی',
        desc: 'این آی‌پی فقط متعلق به شماست. هیچ‌کس دیگری از آن استفاده نمی‌کند و تا زمانی که اشتراک شما فعال است، تغییر نمی‌کند و به فرد دیگری واگذار نمی‌شود.',
      },
      {
        title: 'کشور را خودتان انتخاب کنید',
        desc: 'محل آی‌پی را انتخاب کنید: دیتاسنترهایی در آلمان، فنلاند، سنگاپور و ایالات متحده.',
      },
      {
        title: 'آماده در چند دقیقه',
        desc: 'به‌محض تأیید سفارش، سرور اختصاصی شما به‌صورت خودکار ساخته می‌شود. بدون مراحل دستی و بدون ارسال تیکت.',
      },
      {
        title: '۴ پروفایل آماده',
        desc: 'برای هر آی‌پی چهار پروفایل اتصال آماده می‌شود تا آن را روی گوشی، لپ‌تاپ و سرور استفاده کنید. فقط دانلود و وارد کنید.',
      },
      {
        title: 'سرور مخصوص شما',
        desc: 'این یک استخر اشتراکی نیست. شما یک سرور ابری اختصاصی واقعی دارید؛ بدون شلوغی، بدون اعتبار خراب به ارث‌رسیده و بدون محدودیت سرعت.',
      },
      {
        title: 'همیشه در دسترس',
        desc: 'سرور شما ۲۴ ساعته روشن است و در صورت هر مشکلی خودکار راه‌اندازی مجدد می‌شود؛ پس هر وقت لازم داشتید، آی‌پی شما آماده است.',
      },
    ],

    useCasesTitle: 'چه کسانی به آی‌پی ثابت نیاز دارند؟',
    useCasesSub:
      'هر کسی که برای کار، امنیت یا دسترسی به یک هویت پایدار و قابل‌اعتماد در اینترنت نیاز دارد.',
    useCases: [
      {
        title: 'کسب‌وکار و لیست سفید',
        desc: 'یک آی‌پی ثابت را در لیست سفید درگاه پرداخت، پنل بانکی، CRM یا ERP خود ثبت کنید. کل تیم شما از هر جا که کار کند، با همان آی‌پی شناخته می‌شود.',
      },
      {
        title: 'مدیریت امن سرورها',
        desc: 'سرورها، دیتابیس‌ها و پنل‌های مدیریتی را طوری قفل کنید که فقط آی‌پی اختصاصی شما به آن‌ها دسترسی داشته باشد. یک لایه امنیتی ساده و مؤثر.',
      },
      {
        title: 'تیم‌های دورکار',
        desc: 'به همکاران و پیمانکاران پراکنده یک نشانی مشترک و قابل‌پیش‌بینی بدهید؛ مثل شبکه‌ی یک دفتر که همه‌جا همراه افراد است.',
      },
      {
        title: 'توسعه‌دهندگان و DevOps',
        desc: 'از یک آی‌پی خروجی پایدار برای لیست سفید API، وب‌هوک‌ها، پایپ‌لاین‌های CI/CD، محیط‌های آزمایشی و یکپارچه‌سازی با سرویس‌های ثالث استفاده کنید.',
      },
      {
        title: 'فروشگاه آنلاین و بازاریابی',
        desc: 'حساب‌های فروشگاهی، بازارچه‌ها و تبلیغاتی را از یک نشانی ثابت مدیریت کنید تا تغییر مداوم آی‌پی باعث فعال‌شدن بررسی‌های امنیتی نشود.',
      },
      {
        title: 'فریلنسرها و کار بین‌المللی',
        desc: 'بسیاری از سامانه‌ها و پلتفرم‌های کارفرمایان فقط از یک نشانی یا منطقه‌ی مشخص اتصال می‌پذیرند. آی‌پی‌ای بگیرید که همیشه همان بماند.',
      },
      {
        title: 'آزمایش منطقه‌ای',
        desc: 'ببینید وب‌سایت، اپلیکیشن یا تبلیغات شما از آلمان، فنلاند، سنگاپور یا آمریکا چگونه دیده می‌شود، پیش از آن‌که مشتریانتان ببینند.',
      },
      {
        title: 'کنترل و پایداری',
        desc: 'ترافیک شما از سروری خارج می‌شود که فقط خودتان از آن استفاده می‌کنید. بدون همسایه، بدون اعتبار مشترک و بدون غافلگیری.',
      },
    ],

    stepsTitle: 'چطور کار می‌کند',
    stepsSub: 'از سفارش تا آماده‌شدن، در چهار قدم ساده.',
    steps: [
      { title: 'لوکیشن را انتخاب کنید', desc: 'کشوری را که می‌خواهید آی‌پی شما در آن باشد انتخاب کنید.' },
      { title: 'پرداخت را کامل کنید', desc: 'پرداخت امن با اشتراک ماهانه. در هر زمان قابل لغو است.' },
      { title: 'سرور آماده می‌شود', desc: 'سرور اختصاصی شما ظرف چند دقیقه به‌صورت خودکار ساخته و تنظیم می‌شود.' },
      { title: 'دانلود و استفاده', desc: 'پروفایل خود را از داشبورد دانلود کنید و روی هر دستگاهی وارد کنید.' },
    ],

    pricingTitle: 'یک پلن، با همه‌چیز',
    pricingSub: 'بدون پلن‌های پیچیده، بدون هزینه‌ی پنهان.',
    pricingNote: 'برای هر آی‌پی اختصاصی. لغو در هر زمان.',
    pricingFeatures: [
      'سرور اختصاصی — فقط برای شما',
      'آی‌پی ثابت و دائمی',
      'انتخاب کشور به دلخواه شما',
      '۴ پروفایل آماده با کد QR',
      'در دسترس ۲۴ ساعته با راه‌اندازی مجدد خودکار',
      'لغو در هر زمان',
    ],
    pricingFooter: 'پرداخت امن · راه‌اندازی سریع · لغو در هر زمان',

    faqTitle: 'پرسش‌های متداول',
    faqs: [
      {
        q: 'آی‌پی ثابت دقیقاً چیست؟',
        a: 'آی‌پی هویت شما در اینترنت است. اتصال‌های خانگی و موبایل معمولاً هر چند وقت یک‌بار آی‌پی جدیدی می‌گیرند. آی‌پی ثابت همیشه یکسان می‌ماند و به همین دلیل برای لیست سفید، دسترسی از راه دور و داشتن هویت پایدار آنلاین قابل‌اعتماد است.',
      },
      {
        q: 'تفاوت آی‌پی اختصاصی با آی‌پی اشتراکی چیست؟',
        a: 'آی‌پی اشتراکی را افراد زیادی هم‌زمان استفاده می‌کنند؛ پس رفتار دیگران به شما هم منتقل می‌شود و ممکن است به همین دلیل مسدود یا با چالش امنیتی روبه‌رو شوید. آی‌پی اختصاصی فقط توسط شما استفاده می‌شود و تا زمانی که اشتراک فعال باشد، مال شماست.',
      },
      {
        q: 'بعد از پرداخت چه چیزی دریافت می‌کنم؟',
        a: 'یک سرور اختصاصی واقعی در کشور انتخابی شما، با آی‌پی ثابت مخصوص خودش. در داشبورد می‌توانید چهار پروفایل آماده را دانلود کنید (یا با کد QR اسکن کنید) و از همان لحظه آی‌پی را روی دستگاه‌هایتان استفاده کنید.',
      },
      {
        q: 'راه‌اندازی چقدر طول می‌کشد؟',
        a: 'معمولاً ۵ تا ۱۰ دقیقه پس از پرداخت. همه‌چیز خودکار است. داشبورد به‌طور خودکار به‌روز می‌شود و به‌محض آماده‌شدن، آی‌پی شما را نشان می‌دهد.',
      },
      {
        q: 'روی چه دستگاه‌هایی قابل استفاده است؟',
        a: 'ویندوز، مک، لینوکس، اندروید و iOS و همچنین سرورها. پروفایل مناسب دستگاه خود را دانلود کنید؛ داشبورد نوع فایل هر پروفایل را نشان می‌دهد.',
      },
      {
        q: 'کدام پروفایل را انتخاب کنم؟',
        a: 'برای بهترین سرعت، «پروفایل سریع» را امتحان کنید و برای بیشترین سازگاری، «پروفایل جامع» را. «پروفایل بومی» با تنظیمات داخلی بسیاری از گوشی‌ها و کامپیوترها کار می‌کند و «پروفایل انعطاف‌پذیر» برای کاربران حرفه‌ای است.',
      },
      {
        q: 'آیا کل تیم می‌تواند از یک آی‌پی استفاده کند؟',
        a: 'بله. می‌توانید پروفایل‌ها را با همکارانتان به اشتراک بگذارید تا همه با همان آی‌پی اختصاصی شناخته شوند. این برای لیست سفید در ابزارهای کسب‌وکار ایده‌آل است.',
      },
      {
        q: 'آیا می‌توانم کشور را انتخاب یا عوض کنم؟',
        a: 'کشور را هنگام سفارش انتخاب می‌کنید. اگر بعداً به کشور دیگری نیاز داشتید، یک آی‌پی جدید در آن لوکیشن سفارش دهید؛ تعداد آی‌پی‌ها محدود نیست.',
      },
      {
        q: 'اگر اشتراک را لغو کنم چه می‌شود؟',
        a: 'سرور و آی‌پی شما در پایان دوره‌ی پرداخت آزاد می‌شود. هر زمان بخواهید می‌توانید دوباره سفارش دهید، اما تضمین نمی‌کنیم همان آی‌پی قبلی را دوباره بگیرید.',
      },
      {
        q: 'چطور پشتیبانی بگیرم؟',
        a: 'به support@zivastatic.com ایمیل بزنید و «شناسه‌ی سرور» نمایش‌داده‌شده در صفحه‌ی جزئیات آی‌پی را هم بنویسید. در اسرع وقت پاسخ می‌دهیم.',
      },
    ],

    ctaTitle: 'آماده‌اید آی‌پی ثابت خودتان را بگیرید؟',
    ctaSub: 'یک لوکیشن انتخاب کنید، سفارش را کامل کنید و آی‌پی اختصاصی‌تان ظرف چند دقیقه آماده است.',
    ctaButton: 'همین حالا شروع کنید',

    footerOrder: 'سفارش',
    footerLogin: 'ورود',
    footerRegister: 'ثبت‌نام',
    rights: 'تمامی حقوق محفوظ است.',
  },

  auth: {
    email: 'نشانی ایمیل',
    password: 'گذرواژه',
    confirmPassword: 'تکرار گذرواژه',
    loginTitle: 'خوش آمدید',
    loginSub: 'برای مدیریت آی‌پی‌های ثابت خود وارد شوید',
    loginButton: 'ورود',
    loginLoading: 'در حال ورود...',
    loginError: 'ایمیل یا گذرواژه نادرست است.',
    noAccount: 'حساب کاربری ندارید؟',
    createFree: 'رایگان بسازید',
    registerTitle: 'ساخت حساب کاربری',
    registerSub: 'آی‌پی ثابت خود را در چند دقیقه بگیرید',
    perks: [
      'آی‌پی اختصاصی مخصوص خودتان',
      '۴ پروفایل آماده همراه سفارش',
      'آماده در کمتر از ۱۰ دقیقه پس از سفارش',
    ],
    registerButton: 'ساخت حساب',
    registerLoading: 'در حال ساخت حساب...',
    registerError: 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.',
    passwordMismatch: 'گذرواژه‌ها یکسان نیستند.',
    haveAccount: 'قبلاً ثبت‌نام کرده‌اید؟',
    signIn: 'ورود',
  },

  order: {
    title: 'لوکیشن آی‌پی خود را انتخاب کنید',
    sub: 'کشوری را که می‌خواهید آی‌پی اختصاصی شما در آن باشد انتخاب کنید. سرور شما به‌صورت خودکار همان‌جا آماده می‌شود.',
    steps: ['انتخاب لوکیشن', 'تکمیل سفارش', 'آماده‌سازی سرور', 'دانلود و استفاده'],
    available: 'لوکیشن‌های موجود',
    locationsCount: (n) => `${n.toLocaleString('fa-IR')} لوکیشن`,
    loadingLocations: 'در حال بارگذاری لوکیشن‌ها...',
    loadError: 'بارگذاری لوکیشن‌ها انجام نشد. لطفاً صفحه را رفرش کنید.',
    summary: 'خلاصه سفارش',
    selectedLocation: 'لوکیشن انتخاب‌شده',
    selectLocation: 'یک لوکیشن انتخاب کنید',
    included: [
      'سرور اختصاصی فقط برای آی‌پی شما',
      '۴ پروفایل آماده',
      'در دسترس ۲۴ ساعته',
      'لغو در هر زمان',
    ],
    monthlyTotal: 'مبلغ ماهانه',
    processing: 'در حال پردازش...',
    continue: 'ادامه و پرداخت',
    live: 'آی‌پی شما ظرف ۱۰ دقیقه آماده می‌شود',
    checkoutError: 'شروع پرداخت انجام نشد. لطفاً دوباره تلاش کنید.',
  },

  dashboard: {
    title: 'آی‌پی‌های ثابت من',
    newIp: 'آی‌پی جدید',
    total: 'کل آی‌پی‌ها',
    active: 'فعال',
    provisioning: 'در حال راه‌اندازی',
    loadError: 'بارگذاری آی‌پی‌های شما انجام نشد.',
    loading: 'در حال بارگذاری آی‌پی‌های شما...',
    emptyTitle: 'هنوز آی‌پی ثابتی ندارید',
    emptySub: 'اولین آی‌پی ثابت اختصاصی خود را سفارش دهید. ظرف چند دقیقه به‌صورت خودکار آماده می‌شود.',
    emptyButton: 'اولین آی‌پی ثابت را بگیرید',
  },

  card: {
    ipAddress: 'آدرس آی‌پی',
    assigning: 'در حال تخصیص...',
    manage: 'مدیریت آی‌پی',
  },

  detail: {
    back: 'بازگشت به داشبورد',
    title: 'آی‌پی ثابت شما',
    ipAddress: 'آدرس آی‌پی',
    beingAssigned: 'در حال تخصیص...',
    serverId: 'شناسه سرور',
    location: 'لوکیشن',
    created: 'تاریخ ساخت',
    notFound: 'پیدا نشد',
    notFoundText: 'این آی‌پی وجود ندارد یا شما به آن دسترسی ندارید.',
    loadError: 'بارگذاری جزئیات آی‌پی انجام نشد.',
    settingUpTitle: 'در حال راه‌اندازی سرور شما',
    settingUpText:
      'سرور اختصاصی شما در حال ساخت است و پروفایل‌ها در حال آماده‌سازی‌اند. این کار حدود ۵ تا ۱۰ دقیقه طول می‌کشد و صفحه خودکار به‌روز می‌شود.',
    profilesTitle: 'پروفایل‌های اتصال',
    profilesHint: 'دانلود و استفاده روی هر دستگاه',
    finalizing: 'پروفایل‌های شما در حال نهایی‌شدن است. لطفاً چند لحظه‌ی دیگر صفحه را رفرش کنید.',
    howTitle: 'روش استفاده',
    howText:
      'پروفایل مناسب دستگاه خود را دانلود کنید و آن را در یک اپلیکیشن سازگار یا تنظیمات شبکه‌ی داخلی دستگاه وارد کنید. پس از فعال‌سازی، ترافیک شما از آی‌پی اختصاصی زیر خارج می‌شود:',
    errorTitle: 'راه‌اندازی ناموفق بود',
    errorText: 'در آماده‌سازی سرور شما مشکلی پیش آمد. لطفاً با پشتیبانی تماس بگیرید و شناسه‌ی سرور را همراه پیام بفرستید.',
  },

  profiles: {
    download: 'دانلود',
    qr: 'کد QR',
    downloadError: 'دانلود پروفایل انجام نشد. لطفاً دوباره تلاش کنید.',
    openvpn: { name: 'پروفایل جامع', desc: 'فایل پروفایل · سازگار با بیشتر دستگاه‌ها' },
    wireguard: { name: 'پروفایل سریع', desc: 'فایل پروفایل · سبک و سریع' },
    ikev2: { name: 'پروفایل بومی', desc: 'فایل گواهی · داخلی در بسیاری از دستگاه‌ها' },
    v2ray: { name: 'پروفایل انعطاف‌پذیر', desc: 'فایل پروفایل · برای کاربران حرفه‌ای' },
  },

  locations: {
    cities: {
      Falkenstein: 'فالکنشتاین',
      Nuremberg: 'نورنبرگ',
      Helsinki: 'هلسینکی',
      Singapore: 'سنگاپور',
      Ashburn: 'اشبرن',
      Hillsboro: 'هیلزبورو',
    },
    countries: {
      Germany: 'آلمان',
      Finland: 'فنلاند',
      Singapore: 'سنگاپور',
      'United States': 'ایالات متحده',
      USA: 'ایالات متحده',
    },
  },
}

export default { en, fa }
