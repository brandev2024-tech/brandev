/* =============================================================================
   ALFRED CALAWA — SITE CONFIG
   -----------------------------------------------------------------------------
   Every piece of content on the site lives in this file. Edit freely; you never
   need to touch index.html, css/ or js/ to change text, projects or prices.

   Anything inside [square brackets] is a PLACEHOLDER you should replace.
   Search this file for "[" to find them all.
   ========================================================================== */

window.SITE_CONFIG = {
  /* ---------------------------------------------------------------------------
     PROFILE
  --------------------------------------------------------------------------- */
  profile: {
    name: "Alfred Calawa", // first + last name only — shown in hero, navbar, footer
    initials: "AC", // navbar monogram
    title: "Freelance Software Engineer · Web & App",
    location: "Baguio City, Philippines 2600",
    workMode: "Available for remote work and freelance projects.",
    valueStatement: "I design and build systems and apps that make work faster.",
    bio: "I'm a freelance software engineer from Baguio City. I build web systems, apps and automation tools that save people time.",
    // Rotating role line in the hero
    roles: ["Web Developer", "App Developer", "Systems Builder", "Problem Solver"],
    // Path to your resume PDF (e.g. "assets/resume.pdf"). Leave "" to hide the button.
    resume: "",
    // Your portrait. Generate both files with:  python tools/process_photo.py path/to/raw-photo.jpg
    // Leave both "" to show the placeholder.
    photo: {
      webp: "assets/photo/alfred-calawa.webp",
      fallback: "assets/photo/alfred-calawa.png", // PNG (transparent) or JPG for browsers without WebP
      alt: "Alfred Calawa",
    },
  },

  /* ---------------------------------------------------------------------------
     AVAILABILITY  — flip `status` to "booked" and the whole site updates
     (badge text, dot colour turns amber, footer status).
  --------------------------------------------------------------------------- */
  availability: {
    status: "available", // "available" | "booked"
    availableText: "Open to work · Freelance & remote",
    bookedText: "Currently booked · next opening [Month Year]",
    shortAvailable: "Open to work",
    shortBooked: "Currently booked",
    openTo: ["Freelance projects", "Full-time remote roles", "Part-time remote roles"],
  },

  /* ---------------------------------------------------------------------------
     CONTACT & SOCIALS
  --------------------------------------------------------------------------- */
  contact: {
    email: "calawa.alfredbrandon@gmail.com", // used for mailto links, copy button, footer, quote form and SEO data
    phone: "", // optional, e.g. "+63 900 000 0000" — leave "" to hide
    replyNote: "I usually reply within 24 hours.",
    // Formspree: create a form at https://formspree.io and paste its endpoint,
    // e.g. "https://formspree.io/f/abcdwxyz". Leave "" to fall back to the
    // visitor's email app (mailto:) so no message is ever lost.
    formEndpoint: "",
    budgets: [
      "Under ₱15,000",
      "₱15,000 – ₱40,000",
      "₱40,000 – ₱80,000",
      "₱80,000 – ₱150,000",
      "₱150,000+",
      "Not sure yet",
    ],
    timelines: ["ASAP (rush)", "Within 1 month", "1–3 months", "3+ months", "Flexible"],
  },

  socials: [
    { label: "GitHub", icon: "github", url: "https://github.com/[username]" },
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/[username]" },
  ],

  /* ---------------------------------------------------------------------------
     ABOUT
  --------------------------------------------------------------------------- */
  about: {
    story: [
      "Most of my work starts with a task someone dreads every week, like reformatting documents, cross-checking records or rebuilding the same report by hand. I turn it into a tool that does the job in minutes.",
      "Before tech, I worked hands-on jobs, which taught me discipline, resourcefulness and how to get real work done. I'm also open to full-time or part-time remote roles.",
    ],
    facts: [
      { label: "Based in", value: "Baguio City, Philippines 2600" },
      { label: "Work style", value: "Remote · Freelance" },
      { label: "Focus", value: "Web systems · Apps · Automation" },
      { label: "Clients", value: "Government offices, entrepreneurs, individuals" },
    ],
  },

  /* ---------------------------------------------------------------------------
     IMPACT STATS — replace with your real numbers
  --------------------------------------------------------------------------- */
  stats: [
    { value: 12, suffix: "+", label: "Apps & systems shipped" }, // [replace]
    { value: 5, suffix: "", label: "Offices served" }, // [replace]
    { value: 1500, suffix: "+", label: "Hours saved for teams" }, // [replace]
    { value: 100, suffix: "%", label: "Projects delivered" }, // [replace]
  ],

  /* ---------------------------------------------------------------------------
     SERVICES  (icon names: web, phone, cart, bolt, merge, globe, wrench)
  --------------------------------------------------------------------------- */
  services: [
    {
      icon: "web",
      title: "Custom Web Systems",
      desc: "Management systems built around how your office actually works.",
      items: ["Management systems", "Dashboards", "Records & inventory", "Admin panels"],
      pricingId: "web-system",
    },
    {
      icon: "phone",
      title: "Mobile Apps",
      desc: "Fast, focused apps for customers or your own team.",
      items: ["Business apps", "E-commerce apps", "Internal-use apps"],
      pricingId: "android",
    },
    {
      icon: "cart",
      title: "E-commerce / Online Stores",
      desc: "Sell online with tools you control end to end.",
      items: ["Catalog & cart", "Orders & payments", "Seller / admin tools"],
      pricingId: "ecommerce",
    },
    {
      icon: "bolt",
      title: "Office Automation Tools",
      desc: "Turn hours of repetitive work into a single click.",
      items: ["Document formatters", "Report generators", "Repetitive-task removal"],
      pricingId: "automation",
    },
    {
      icon: "merge",
      title: "Data Processing & Cross-Matching",
      desc: "Clean, match and reconcile records you can finally trust.",
      items: ["Data cleanup", "Matching & dedupe", "Reconciliation", "Reporting"],
      pricingId: "automation",
    },
    {
      icon: "globe",
      title: "Websites & Landing Pages",
      desc: "Sharp, fast sites that make a strong first impression.",
      items: ["Business websites", "Landing pages", "Portfolios"],
      pricingId: "website",
    },
    {
      icon: "wrench",
      title: "Maintenance & Support",
      desc: "Keep what you've built healthy, secure and up to date.",
      items: ["Bug fixes", "Updates", "Hosting help"],
      pricingId: "maintenance",
    },
  ],

  /* ---------------------------------------------------------------------------
     SKILLS / TECH STACK
     `devicon` = folder/file name from https://devicon.dev (logo loads from CDN).
     Use `src` instead to point at your own logo file. `invertDark` flips
     black logos to white in dark mode.  [Adjust to your real stack]
  --------------------------------------------------------------------------- */
  skills: [
    {
      group: "Frontend",
      items: [
        { name: "HTML5", devicon: "html5/html5-original" },
        { name: "CSS3", devicon: "css3/css3-original" },
        { name: "JavaScript", devicon: "javascript/javascript-original" },
        { name: "TypeScript", devicon: "typescript/typescript-original" },
        { name: "React", devicon: "react/react-original" },
        { name: "Tailwind CSS", devicon: "tailwindcss/tailwindcss-original" },
      ],
    },
    {
      group: "Backend",
      items: [
        { name: "Node.js", devicon: "nodejs/nodejs-original" },
        { name: "Express", devicon: "express/express-original", invertDark: true },
        { name: "PHP", devicon: "php/php-original" },
        { name: "Laravel", devicon: "laravel/laravel-original" },
        { name: "Python", devicon: "python/python-original" },
      ],
    },
    {
      group: "Mobile Apps",
      items: [
        { name: "Kotlin", devicon: "kotlin/kotlin-original" },
        { name: "Java", devicon: "java/java-original" },
        { name: "Android", devicon: "android/android-original" },
        { name: "Android Studio", devicon: "androidstudio/androidstudio-original" },
        { name: "Firebase", devicon: "firebase/firebase-original" },
      ],
    },
    {
      group: "Database",
      items: [
        { name: "MySQL", devicon: "mysql/mysql-original" },
        { name: "PostgreSQL", devicon: "postgresql/postgresql-original" },
        { name: "SQLite", devicon: "sqlite/sqlite-original" },
        { name: "MongoDB", devicon: "mongodb/mongodb-original" },
        { name: "Supabase", devicon: "supabase/supabase-original" },
      ],
    },
    {
      group: "Cloud & Hosting",
      items: [
        { name: "Cloudflare", devicon: "cloudflare/cloudflare-original" },
        { name: "DigitalOcean", devicon: "digitalocean/digitalocean-original" },
      ],
    },
    {
      group: "Tools",
      items: [
        { name: "Git", devicon: "git/git-original" },
        { name: "GitHub", devicon: "github/github-original", invertDark: true },
        { name: "VS Code", devicon: "vscode/vscode-original" },
        { name: "Figma", devicon: "figma/figma-original" },
        { name: "Docker", devicon: "docker/docker-original" },
      ],
    },
  ],

  /* ---------------------------------------------------------------------------
     PROJECTS
     categories: any of "web", "android" (shown as "Apps"), "government", "tools"
     images: screenshots (WebP). The first is the card cover; the rest show in
             the case-study popup. Empty = a generated illustration.
     mock: "web" | "phone" (style of the generated illustration)
     confidential: true → "Confidential: internal system" badge, blurred image,
                   live links hidden.
  --------------------------------------------------------------------------- */
  projects: [
    {
      id: "dms",
      title: "DMS · Direct Message Us",
      quoteType: "ecommerce", // "Start a similar project" pre-selects this pricing plan
      tagline: "Fashion e-commerce store and installable app",
      categories: ["web", "android"],
      type: "E-commerce",
      mock: "web",
      featured: true,
      summary:
        "An online boutique for cropped fur and faux-fur jackets, tops, dresses and accessories. Customers browse the full catalog, then order through a direct message.",
      role: "Solo developer: design and development",
      impact: "Turned a social-media-only shop into a real storefront where customers can see every item, price and stock label before they message.",
      images: ["assets/projects/dms-cover.webp", "assets/projects/dms-hero.webp"],
      links: { demo: "https://dms.agriscope2026.workers.dev/", repo: "", caseStudy: "" },
      confidential: false,
      detail: {
        problem:
          "The shop sold through social media posts, so customers had to message just to ask about prices, sizes and stock. Items got lost in the feed and the same questions came up again and again.",
        solution:
          "A fast, mobile-first storefront that keeps the direct-message ordering customers already like, but puts the whole catalog, prices and delivery options in one place.",
        features: [
          "Catalog by category: fur jackets, cropped jackets, tops, dresses, bottoms, accessories and bags",
          "Labels for new arrivals, best sellers and items with few left, plus sale prices",
          "Order through Messenger, Instagram or the built-in Direct Ask",
          "Pickup points in Baguio City, La Trinidad and nearby towns, or nationwide shipping via J&T Express and LBC",
          "Payment by GCash, Maya, bank transfer or cash on delivery",
          "Installable as an app on the phone, with optional customer accounts and a wishlist",
        ],
        result:
          "The shop now has its own home online. Customers arrive already knowing what they want, so conversations go straight to ordering instead of back-and-forth questions.",
      },
    },
    {
      id: "division-ms",
      title: "Division Management System",
      tagline: "Operations, records and personnel for a government division",
      categories: ["web", "government"],
      type: "Government",
      mock: "web",
      featured: true,
      summary:
        "A central system for a division's day-to-day operations, records and personnel. It replaced scattered files with one source of truth.",
      role: "Lead developer, from requirements to deployment",
      impact: "Records and personnel data now live in one secure system, so finding information and preparing reports takes far less time.",
      images: [],
      links: { demo: "", repo: "", caseStudy: "" },
      confidential: true,
      detail: {
        problem:
          "Division records and personnel information were spread across folders, spreadsheets and paper. Finding anything was slow and reports were easy to get wrong.",
        solution:
          "A role-based web system with modules for records, personnel and operations, plus reports generated straight from the data.",
        features: [
          "Personnel records and profiles",
          "Document and records management",
          "Operations tracking",
          "Role-based access for staff and administrators",
          "Printable and exportable reports",
        ],
        result:
          "Staff work from the same up-to-date data, and reports that used to be assembled by hand come straight out of the system.",
      },
    },
    {
      id: "doc-formatter",
      title: "Document Formatter",
      tagline: "Office automation for a repetitive formatting task",
      categories: ["tools", "government"],
      type: "Automation",
      mock: "web",
      featured: false,
      summary:
        "A tool that takes raw documents and produces correctly formatted output automatically. No more fixing things line by line.",
      role: "Developer",
      impact: "Formatting work that used to take hours of manual editing is now done in a few clicks, with the same result every time.",
      images: [],
      links: { demo: "", repo: "", caseStudy: "" },
      confidential: true,
      detail: {
        problem: "Staff spent hours formatting office documents by hand to match the required standard, and small mistakes slipped through.",
        solution: "A tool that reads the source files and applies the exact formatting rules automatically.",
        features: [
          "Formats office documents to the official standard",
          "Batch processing: many files at once",
          "Consistent output that matches the official template",
          "Simple interface anyone in the office can use",
        ],
        result: "Hours of repetitive editing turned into a quick, reliable step, freeing staff for work that actually needs them.",
      },
    },
    {
      id: "cross-matching",
      title: "Data Cross-Matching System",
      tagline: "Reconcile records across datasets",
      categories: ["tools", "web", "government"],
      type: "Data",
      mock: "web",
      featured: false,
      summary:
        "Compares records across datasets to surface matches, duplicates and discrepancies, then reports them in a form people can act on.",
      role: "Developer",
      impact: "Replaced record-by-record manual checking with automatic matching and clear discrepancy reports.",
      images: [],
      links: { demo: "", repo: "", caseStudy: "" },
      confidential: true,
      detail: {
        problem: "Records from different sources had to be checked against each other by hand. It was slow, tiring and easy to get wrong.",
        solution: "A matching engine that cleans the data, compares records and flags matches, duplicates and mismatches.",
        features: [
          "Data cleanup and normalization before matching",
          "Exact and fuzzy matching rules",
          "Duplicate and discrepancy flags",
          "Exportable reconciliation reports",
        ],
        result: "Checks that took days of manual comparison now run in minutes, and every mismatch is listed instead of missed.",
      },
    },
    {
      id: "portfolio",
      title: "Personal Portfolio",
      tagline: "This website",
      categories: ["web"],
      type: "Website",
      mock: "web",
      featured: false,
      summary:
        "A fast, accessible portfolio with dark and light themes, a live price estimator and a quote form, all driven by a single config file.",
      role: "Design and development",
      impact: "Clients can see my work, estimate a budget and request a quote in one visit.",
      images: [],
      links: { demo: "", repo: "", caseStudy: "" },
      confidential: false,
      detail: {
        problem: "I needed a site that shows my work clearly and lets clients get a quote without back-and-forth.",
        solution: "A no-build static site where every word, project and price lives in one config file.",
        features: [
          "Dark and light themes",
          "Interactive price estimator",
          "Quote form with validation",
          "Respects reduced-motion preferences",
        ],
        result: "Deploys anywhere static: Vercel, Netlify or GitHub Pages.",
      },
    },
  ],

  projectFilters: [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "android", label: "Apps" },
    { id: "government", label: "Government" },
    { id: "tools", label: "Tools" },
  ],

  /* ---------------------------------------------------------------------------
     PRICING — SAMPLE NUMBERS, replace with your own.
     price: number (shown as "Starting at"), or null for "Custom quote".
     estimator.base: starting point used by the price estimator.
  --------------------------------------------------------------------------- */
  pricing: {
    currency: "₱",
    locale: "en-PH",
    intro:
      "Every project is different. Pricing depends on scope, features, platform and timeline. These are starting points. Get a free quote for an exact price.",
    hourly: { enabled: true, rate: 500, label: "Hourly rate" }, // [replace]
    note:
      "Final price depends on features, integrations, design complexity and deadlines. Payment terms: 50% down, 50% on delivery. Discounts are available for students, NGOs and small businesses.",
    plans: [
      {
        id: "website",
        title: "Website / Landing Page",
        price: 15000, // [replace]
        suffix: "",
        timeline: "1–2 weeks",
        desc: "A polished, fast site that makes your business look its best.",
        includes: ["Responsive design", "Up to [5] pages", "Contact form", "Basic SEO"],
      },
      {
        id: "automation",
        title: "Office Automation Tool",
        price: 8000, // [replace]
        suffix: "",
        timeline: "1–3 weeks",
        desc: "One repetitive task, gone. Formatters, generators, cleanups.",
        includes: ["Custom tool for one repetitive task", "User guide", "[2] revisions"],
      },
      {
        id: "web-system",
        title: "Custom Web System",
        price: 40000, // [replace]
        suffix: "",
        timeline: "3–8 weeks",
        desc: "A management system built around your exact workflow.",
        includes: ["Login & user roles", "Dashboard", "Database", "Reports", "Admin panel"],
        featured: true,
        badge: "Most requested",
      },
      {
        id: "android",
        title: "Mobile App",
        price: 50000, // [replace]
        suffix: "",
        timeline: "4–10 weeks",
        desc: "A focused app for your customers or your team.",
        includes: ["Native / cross-platform app", "Backend & API", "APK or Play Store release"],
      },
      {
        id: "ecommerce",
        title: "E-commerce System / App",
        price: 60000, // [replace]
        suffix: "",
        timeline: "4–10 weeks",
        desc: "Sell online with full control over products and orders.",
        includes: ["Catalog & cart", "Orders & payments", "Inventory", "Admin panel"],
      },
      {
        id: "enterprise",
        title: "Enterprise / Government System",
        price: null,
        suffix: "",
        timeline: "Varies",
        desc: "Multi-module systems for offices with bigger needs.",
        includes: ["Requirements analysis", "Multi-module system", "Remote training", "Documentation"],
      },
      {
        id: "maintenance",
        title: "Maintenance & Support",
        price: 3000, // [replace]
        suffix: "/ month",
        timeline: "Ongoing",
        desc: "Keep things running smoothly after launch.",
        includes: ["Bug fixes", "Updates", "Backups", "Minor changes"],
      },
    ],

    // Price estimator ("Estimate only. Final quote after consultation.")
    estimator: {
      types: [
        { id: "website", label: "Website / Landing Page", base: 15000, unit: "pages", included: 5, perUnit: 2000, max: 20 },
        { id: "automation", label: "Office Automation Tool", base: 8000, unit: "features", included: 1, perUnit: 3000, max: 10 },
        { id: "web-system", label: "Custom Web System", base: 40000, unit: "modules", included: 3, perUnit: 8000, max: 15 },
        { id: "android", label: "Mobile App", base: 50000, unit: "screens", included: 8, perUnit: 3000, max: 40 },
        { id: "ecommerce", label: "E-commerce System / App", base: 60000, unit: "features", included: 6, perUnit: 5000, max: 20 },
      ],
      addons: [
        { id: "admin", label: "Admin panel", price: 10000 },
        { id: "payments", label: "Online payments", price: 8000 },
        { id: "hosting", label: "Hosting & domain setup (1 yr)", price: 5000 },
        { id: "design", label: "Custom UI design", price: 7000 },
      ],
      rush: { label: "Rush delivery", multiplier: 1.3 },
      spread: 1.3, // high end of range = low × spread
    },
  },

  /* ---------------------------------------------------------------------------
     PROCESS
  --------------------------------------------------------------------------- */
  process: [
    { title: "Consultation", desc: "A free call to understand the problem, your users and your deadline." },
    { title: "Proposal & Quote", desc: "A clear scope, timeline and fixed price, so there are no surprises later." },
    { title: "Build & Updates", desc: "Regular progress demos so you see it take shape and can steer early." },
    { title: "Launch & Support", desc: "Deployment, handover and training, plus support once it's live." },
  ],

  /* ---------------------------------------------------------------------------
     EXPERIENCE (newest first). Only IT roles. `current: true` adds the "Present" badge.
  --------------------------------------------------------------------------- */
  experience: [
    {
      role: "Data Controller (IT / Programmer)",
      dates: "2024 – Present",
      current: true, // shows the violet "Present" badge
      points: [
        "Manage, organize and secure the office's data and records.",
        "Build internal systems, including the Division Management System.",
        "Create automation tools like the Document Formatter and the Data Cross-Matching System to remove repetitive manual work.",
        "Provide day-to-day IT support and troubleshooting.",
      ],
    },
    {
      role: "IT Freelancer",
      org: "Self-employed",
      dates: "2022 – 2024",
      points: [
        "Built custom web systems, apps and automation tools for clients.",
        "Handled each project end to end: requirements, design, development and deployment.",
        "Provided support, fixes and updates after launch.",
      ],
    },
  ],

  /* ---------------------------------------------------------------------------
     BEYOND THE CODE (hobbies)
     icon: motorcycle, tent, mountain, run, crosshair, tools, binoculars, flame
     size: "wide" (2 columns) or omit for a normal card. Desktop grid is 4 columns,
     so keep each row adding up to 4 (wide = 2, normal = 1).
     Add more hobbies by adding more items.
  --------------------------------------------------------------------------- */
  hobbiesIntro: "What I do when I'm not building systems.",
  hobbies: [
    { icon: "motorcycle", title: "Motorcycle riding", caption: "Taking the long way through the mountain roads around Baguio, and beyond.", size: "wide" },
    { icon: "tent", title: "Riverside & beach camping", caption: "Pitching a tent by the water and sleeping under the stars." },
    { icon: "mountain", title: "Hiking", caption: "Chasing trails, summits and the view at the top." },
    { icon: "run", title: "Running", caption: "Clearing my head, one kilometer at a time." },
    { icon: "crosshair", title: "FPS gaming", caption: "Quick reflexes, good comms and a bit of strategy." },
    { icon: "tools", title: "Fixing gadgets & appliances", caption: "If something breaks, I want to know why. Then I fix it." },
    { icon: "binoculars", title: "Sightseeing", caption: "Always looking for a new place or a better view." },
  ],

  /* ---------------------------------------------------------------------------
     TESTIMONIALS — leave the array empty to hide the section.
     Only add real quotes from real clients (with their permission).
     Example:
     { quote: "…", name: "Jane Dela Cruz", role: "Owner, Example Shop" }
  --------------------------------------------------------------------------- */
  testimonials: [],

  /* ---------------------------------------------------------------------------
     FAQ
  --------------------------------------------------------------------------- */
  faq: [
    {
      q: "How much does a system cost?",
      a: "It depends on scope: the number of modules, users, integrations and your timeline. Small automation tools start around the prices in the Pricing section; larger systems are quoted after a short consultation. Try the estimator above for a ballpark.",
    },
    {
      q: "How long does it take?",
      a: "A website takes about 1–2 weeks, an automation tool 1–3 weeks, and a custom system or app 3–10 weeks. You'll get a timeline with milestones in the proposal.",
    },
    {
      q: "Do you provide maintenance?",
      a: "Yes. I offer monthly maintenance covering bug fixes, updates, backups and minor changes. If you prefer, I can also do on-call support and charge per fix.",
    },
    {
      q: "Can you work with government offices?",
      a: "Yes. I've built internal systems for government offices and understand the documentation, approval and data-privacy requirements that come with them.",
    },
    {
      q: "Do I own the source code?",
      a: "Yes. Once the project is fully paid, you own the source code and get everything needed to run, host and maintain it.",
    },
    {
      q: "Do you work remotely?",
      a: "Yes. I work fully remotely with clients anywhere, using video calls, regular progress demos and clear written updates. Training and handover are done remotely too.",
    },
  ],
};
