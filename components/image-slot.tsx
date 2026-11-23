import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getImage, type ImageShape, type ImageSlotId } from '@/lib/images'

const shapeClass: Record<ImageShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
  square: 'rounded-none',
}

type ImageSlotProps = {
  id: ImageSlotId
  className?: string
  sizes?: string
  /** Override the shape from lib/images.ts */
  shape?: ImageShape
  showCaption?: boolean
  priority?: boolean
}

export function ImageSlot({ id, className, sizes = '(min-width: 1024px) 50vw, 100vw', shape, showCaption = false, priority }: ImageSlotProps) {
  const config = getImage(id)
  const resolvedShape = shape ?? config.shape ?? 'rounded'

  return (
    <figure className={cn('relative overflow-hidden bg-card', shapeClass[resolvedShape], className)}>
      {config.src ? (
        <Image
          src={config.src}
          alt={config.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={config.fit === 'contain' ? 'object-contain' : 'object-cover'}
          style={{ objectPosition: config.position ?? 'center' }}
        />
      ) : (
        <div
          role="img"
          aria-label={`Image placeholder: ${config.caption ?? config.alt}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-paper/15 bg-[radial-gradient(circle_at_30%_20%,rgb(125_140_255/0.10),transparent_60%)] p-3 text-center"
          style={{ borderRadius: 'inherit' }}
        >
          <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-balance">
            {config.caption ?? 'Image'}
          </span>
          <span className="hidden font-mono text-[9px] text-muted-foreground/60 sm:block">{id}</span>
        </div>
      )}
      {showCaption && config.caption && config.src && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs text-paper/80">
          {config.caption}
        </figcaption>
      )}
    </figure>
  )
}
