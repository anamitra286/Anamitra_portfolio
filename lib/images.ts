/**
 * Centralized image configuration.
 *
 * To add a photo: drop the file into /public/images and set `src`
 * to its path (e.g. '/images/me.jpg'). Slots with `src: null` render
 * as labelled placeholders, so nothing in component code needs changing.
 */

export type ImageFit = 'cover' | 'contain'
export type ImageShape = 'circle' | 'rounded' | 'square'

export type ImageSlotConfig = {
  src: string | null
  alt: string
  fit?: ImageFit
  shape?: ImageShape
  /** CSS object-position, e.g. 'center top' */
  position?: string
  caption?: string
}

export const imageSlots = {
  // Hero — ring centre and orbiting satellites
  'hero.center': { src: '/images/hero-center.png', alt: 'Portrait of KR Anamitra', fit: 'cover', shape: 'circle', caption: 'Your portrait' },
  'hero.satellite.1': { src: '/images/hero-event.png', alt: 'Event photograph', fit: 'cover', shape: 'circle', caption: 'Event' },
  'hero.satellite.2': { src: '/images/hero-award.png', alt: 'Achievement photograph', fit: 'cover', shape: 'circle', caption: 'Award' },
  'hero.satellite.3': { src: '/images/hero-work.png', alt: 'Work snapshot', fit: 'cover', shape: 'circle', caption: 'Work' },

  // About
  'about.portrait': { src: '/images/about-portrait.jpg', alt: 'KR Anamitra', fit: 'cover', shape: 'rounded', caption: 'Portrait / candid' },

  // Projects
  'project.decisionos.cover': { src: null, alt: 'DecisionOS cover', fit: 'cover', shape: 'rounded', caption: 'DecisionOS — cover' },
  'project.decisionos.1': { src: null, alt: 'DecisionOS screen', fit: 'cover', shape: 'rounded', caption: 'Screen 01' },
  'project.decisionos.2': { src: null, alt: 'DecisionOS screen', fit: 'cover', shape: 'rounded', caption: 'Screen 02' },
  'project.bloodbot.cover': { src: null, alt: 'AI Blood Donation Chatbot cover', fit: 'cover', shape: 'rounded', caption: 'Chatbot — cover' },
  'project.bloodbot.1': { src: null, alt: 'Chatbot conversation', fit: 'cover', shape: 'rounded', caption: 'Conversation flow' },
  'project.bloodbot.2': { src: null, alt: 'Chatbot workflow', fit: 'cover', shape: 'rounded', caption: 'Workflow map' },
  'project.portfolio.cover': { src: null, alt: 'Digital Portfolio Maker cover', fit: 'cover', shape: 'rounded', caption: 'Portfolio Maker — cover' },
  'project.portfolio.1': { src: null, alt: 'Portfolio Maker editor', fit: 'cover', shape: 'rounded', caption: 'Editor' },
  'project.portfolio.2': { src: null, alt: 'Generated portfolio', fit: 'cover', shape: 'rounded', caption: 'Output' },
  'project.llmsec.cover': { src: null, alt: 'Multimodal LLM security research cover', fit: 'cover', shape: 'rounded', caption: 'Research — cover' },
  'project.llmsec.1': { src: null, alt: 'Research figure', fit: 'contain', shape: 'rounded', caption: 'Figure 01' },
  'project.llmsec.2': { src: null, alt: 'Research figure', fit: 'contain', shape: 'rounded', caption: 'Figure 02' },

  // Achievements & experience
  'achievement.avishkar': { src: null, alt: 'SCOE AVISHKAR 2025', fit: 'cover', shape: 'rounded', caption: 'AVISHKAR 2025' },
  'achievement.tcs': { src: null, alt: 'TCS selection', fit: 'contain', shape: 'rounded', caption: 'TCS — offer / selection' },
  'experience.arome': { src: '/images/experience-arome.png', alt: 'ARÔMÉ', fit: 'contain', shape: 'rounded', caption: 'ARÔMÉ' },
  'experience.foodaspas': { src: '/images/experience-foodaspas.png', alt: 'foodaspas', fit: 'cover', shape: 'rounded', caption: 'foodaspas' },
  'other.podcast': { src: '/images/other-podcast.jpg', alt: 'Beyond Curriculum podcast', fit: 'cover', shape: 'rounded', caption: 'Podcast' },
  'other.moderation': { src: '/images/other-moderation.jpg', alt: 'Event moderation', fit: 'cover', shape: 'rounded', caption: 'On stage' },

  // Circular gallery
  'gallery.1': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Event photograph' },
  'gallery.2': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Award photograph' },
  'gallery.3': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Team moment' },
  'gallery.4': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Presentation' },
  'gallery.5': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Podcast set' },
  'gallery.6': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Workshop' },
  'gallery.7': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Screenshot' },
  'gallery.8': { src: null, alt: 'Gallery image', fit: 'cover', shape: 'rounded', caption: 'Behind the scenes' },

  // Certificates
  'certificate.1': { src: null, alt: 'Certificate', fit: 'contain', shape: 'rounded', caption: 'Certificate 01' },
  'certificate.2': { src: null, alt: 'Certificate', fit: 'contain', shape: 'rounded', caption: 'Certificate 02' },
  'certificate.3': { src: null, alt: 'Certificate', fit: 'contain', shape: 'rounded', caption: 'Certificate 03' },
  'certificate.4': { src: null, alt: 'Certificate', fit: 'contain', shape: 'rounded', caption: 'Certificate 04' },
} satisfies Record<string, ImageSlotConfig>

export type ImageSlotId = keyof typeof imageSlots

export function getImage(id: ImageSlotId): ImageSlotConfig {
  return imageSlots[id]
}

/** True when a real photo is configured for this slot. Used to hide empty slots. */
export function hasImage(id: ImageSlotId): boolean {
  return imageSlots[id].src !== null
}

export const galleryIds: ImageSlotId[] = [
  'gallery.1',
  'gallery.2',
  'gallery.3',
  'gallery.4',
  'gallery.5',
  'gallery.6',
  'gallery.7',
  'gallery.8',
]

export const certificateIds: ImageSlotId[] = ['certificate.1', 'certificate.2', 'certificate.3', 'certificate.4']
