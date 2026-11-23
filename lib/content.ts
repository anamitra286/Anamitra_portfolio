import type { ImageSlotId } from './images'

/**
 * Central content for the whole portfolio.
 * Anything marked `PLACEHOLDER` should be replaced with your real details.
 */

export const site = {
  wordmark: 'ANAMITRA',
  fullName: 'KR Anamitra',
  title: 'KR Anamitra — Product Thinker & Creative Technologist',
  description:
    'Portfolio of KR Anamitra, a Computer Engineering student at Pillai College of Engineering working at the intersection of technology, design and business.',
  location: 'Mumbai, India',
  status: 'Open to product roles',
  /** PLACEHOLDER — replace with your real email address. */
  email: 'anakr28.genai@gmail.com',
}

export const navItems = [
  { label: 'About', href: '/about', index: '01' },
  { label: 'Work', href: '/work', index: '02' },
  { label: 'Achievements', href: '/achievements', index: '03' },
  { label: 'Contact', href: '/contact', index: '04' },
] as const

export const hero = {
  lines: ['BUILDING', 'IDEAS.', 'DESIGNING', "WHAT'S NEXT."],
  roles: 'Computer Engineering Student | Product Thinker | Creative Technologist',
  intro:
    'I enjoy working at the intersection of technology, design and business — turning complex ideas into thoughtful digital experiences.',
  typewriter: ['Product Thinker', 'Creative Problem Solver', 'Technology Enthusiast', 'Creative Strategist'],
}

export const about = {
  heading: 'A LITTLE ABOUT THE MIND BEHIND THE WORK.',
  lead: 'I’m a Computer Engineering student at Pillai College of Engineering, drawn to the space where products, people and technology meet.',
  pillars: [
    {
      label: 'Background',
      body: 'Trained as an engineer, I learned to break systems down into logic and data. Along the way I discovered I care just as much about why something is built as how it works.',
    },
    {
      label: 'Interests',
      body: 'Product development, user experience, emerging technology and storytelling — and the strategy that connects a good idea to the people it is meant for.',
    },
    {
      label: 'Approach',
      body: 'Start with the person, not the feature. I research, map trade-offs, prototype quickly and keep refining until the experience feels obvious in hindsight.',
    },
  ],
  skills: [
    { category: 'Technical', items: ['Python', 'SQL', 'HTML', 'CSS', 'SEO Optimization'] },
    {
      category: 'Product',
      items: ['Product Thinking', 'User Research', 'Market Research', 'Product Roadmapping', 'UX Fundamentals'],
    },
    {
      category: 'Creative',
      items: ['Content Strategy', 'Creative Writing', 'UI/UX Collaboration', 'Visual Design'],
    },
    { category: 'Tools', items: ['Canva', 'Figma', 'Notion', 'Google Workspace'] },
    { category: 'Soft Skills', items: ['Public Speaking', 'Strategic Planning', 'Communication'] },
  ],
  /** Add exact dates in `period` whenever you like. */
  timeline: [
    {
      period: 'Chapter 01',
      title: 'Computer Engineering',
      place: 'Pillai College of Engineering',
      body: 'Built my technical foundation in programming, data and systems while discovering a pull towards product and design.',
    },
    {
      period: 'Chapter 02',
      title: 'Finding a voice',
      place: 'Pillai University — Beyond Curriculum',
      body: 'Hosted a campus podcast and moderated events, learning to listen closely and communicate ideas clearly.',
    },
    {
      period: 'Chapter 03',
      title: 'AI Content Creator',
      place: 'foodaspas',
      body: 'Blended AI tools with storytelling to plan and produce content that connected with a real audience.',
    },
    {
      period: 'Chapter 04',
      title: 'Associate Product Manager',
      place: 'ARÔMÉ',
      body: 'Stepped into product — translating user needs and market signals into priorities and roadmaps.',
    },
    {
      period: '2025',
      title: 'SCOE AVISHKAR',
      place: 'State-level research convention',
      body: 'Selected participant, presenting research to a state-level panel.',
    },
    {
      period: '2026',
      title: 'Tata Consultancy Services',
      place: 'Assistant System Engineer-Trainee',
      body: 'Selected as an incoming Assistant System Engineer-Trainee, Grade Y.',
    },
  ],
}

export type Project = {
  slug: string
  index: string
  title: string
  tagline: string
  description: string
  role: string
  tech: string[]
  problem: string
  contribution: string
  cover: ImageSlotId
  gallery: ImageSlotId[]
  /** Repository or live link for the project. */
  href: string
}

export const projects: Project[] = [
  {
    slug: 'decisionos',
    index: '01',
    title: 'DecisionOS',
    tagline: 'An operating system for everyday choices.',
    description:
      'A decision-making application designed to help users make everyday decisions through contextual reasoning, preferences, trade-offs and regret tracking.',
    role: 'Product Lead & Designer',
    tech: ['Product Strategy', 'UX Research', 'Figma', 'Python'],
    problem:
      'Small daily decisions quietly drain attention. Most tools offer lists, not reasoning — and nothing learns from the choices we later regret.',
    contribution:
      'Defined the decision model around context, preferences and trade-offs, and designed a regret-tracking loop so the product improves its guidance over time.',
    cover: 'project.decisionos.cover',
    gallery: ['project.decisionos.1', 'project.decisionos.2'],
    href: 'https://github.com/anamitra286/DecisionOS',
  },
  {
    slug: 'digital-portfolio-maker',
    index: '02',
    title: 'Digital Portfolio Maker',
    tagline: 'A portfolio in minutes, not weekends.',
    description:
      'A dynamic web application designed to simplify portfolio creation for students through a responsive interface.',
    role: 'Frontend Developer & UX',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    problem:
      'Students have work worth showing but lack the time or design skills to present it well online.',
    contribution:
      'Designed a guided, template-driven flow and built a responsive interface that turns simple inputs into a polished portfolio.',
    cover: 'project.portfolio.cover',
    gallery: ['project.portfolio.1', 'project.portfolio.2'],
    href: 'https://github.com/danish-razaa/Portfolio-Maker-',
  },
  {
    slug: 'multimodal-llm-security',
    index: '03',
    title: 'Multimodal LLM Security Research',
    tagline: 'What happens when the image is the attack?',
    description:
      'Research exploring input-level image security and defenses against soft-prompt injection attacks in multimodal large language models.',
    role: 'Researcher',
    tech: ['Multimodal LLMs', 'Adversarial ML', 'Python', 'Research Methods'],
    problem:
      'Multimodal models can be steered by instructions hidden inside images — a soft-prompt injection surface that text-only defenses miss.',
    contribution:
      'Studied input-level image security, analysed injection vectors and explored defensive strategies to make multimodal systems more robust.',
    cover: 'project.llmsec.cover',
    gallery: ['project.llmsec.1', 'project.llmsec.2'],
    href: 'https://github.com/anamitra286/Softprompt-Hidden-prompt-detection',
  },
]

export const achievements = {
  heading: 'MILESTONES, NOT JUST MOMENTS.',
  highlights: [
    {
      id: 'avishkar',
      year: '2025',
      title: 'SCOE AVISHKAR 2025',
      body: 'Selected participant at a state-level research convention.',
      image: 'achievement.avishkar' as ImageSlotId,
    },
    {
      id: 'tcs',
      year: '2026',
      title: 'Tata Consultancy Services',
      body: 'Selected, 2026 — Incoming Assistant System Engineer-Trainee, Grade Y.',
      image: 'achievement.tcs' as ImageSlotId,
    },
  ],
  experience: [
    {
      role: 'Associate Product Manager',
      org: 'ARÔMÉ',
      body: 'Translating user needs and market research into product priorities, roadmaps and launch plans.',
      image: 'experience.arome' as ImageSlotId,
    },
    {
      role: 'AI Content Creator',
      org: 'foodaspas',
      body: 'Producing AI-assisted content and shaping content strategy for a growing food brand.',
      image: 'experience.foodaspas' as ImageSlotId,
    },
  ],
  other: [
    {
      role: 'Podcast Host',
      org: 'Pillai University — Beyond Curriculum',
      body: 'Hosting conversations that go beyond the syllabus with students, faculty and guests.',
      image: 'other.podcast' as ImageSlotId,
    },
    {
      role: 'Content, Communication & Moderation',
      org: 'Events & Campus Initiatives',
      body: 'Creating content, leading communication and moderating events on stage.',
      image: 'other.moderation' as ImageSlotId,
    },
  ],
}

export const contact = {
  heading: 'HAVE SOMETHING INTERESTING IN MIND?',
  closing: 'GOOD IDEAS START WITH A CONVERSATION.',
  /** PLACEHOLDER — replace each href with your real profile URL. */
  socials: [
    { label: 'Email', handle: site.email, href: `mailto:${site.email}` },
    { label: 'LinkedIn', handle: '/in/kr-anamitra-30a7b1261', href: 'https://www.linkedin.com/in/kr-anamitra-30a7b1261/' },
    { label: 'GitHub', handle: '@anamitra286', href: 'https://github.com/anamitra286' },
  ],
}
