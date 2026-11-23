'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ease } from '@/lib/gsap'
import { projects, type Project } from '@/lib/content'
import { ImageSlot } from '@/components/image-slot'
import { hasImage } from '@/lib/images'
import { cn } from '@/lib/utils'
import { MagneticButton } from '@/components/magnetic-button'

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP({ scope: ref })

  const onMove = contextSafe((event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !tiltRef.current) return
    const rect = tiltRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(tiltRef.current, { rotateY: px * 8, rotateX: -py * 8, duration: 0.6, ease: ease.soft })
    tiltRef.current.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    tiltRef.current.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  })
  const onLeave = contextSafe(() => {
    gsap.to(tiltRef.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: ease.out })
  })

  return (
    <article ref={ref} id={project.slug} aria-labelledby={`${project.slug}-title`} className="scroll-mt-24 [perspective:1600px]" data-reveal>
      <div
        ref={tiltRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative grid gap-8 overflow-hidden rounded-3xl border border-paper/10 bg-card p-4 [transform-style:preserve-3d] md:p-6 lg:grid-cols-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgb(125 140 255 / 0.10), transparent 60%)' }}
        />
        {hasImage(project.cover) && (
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl lg:col-span-7">
            <ImageSlot
              id={project.cover}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div
          className={cn(
            'relative flex flex-col justify-between gap-8 lg:py-2 lg:pr-2',
            hasImage(project.cover) ? 'lg:col-span-5' : 'lg:col-span-12 lg:max-w-3xl',
          )}
        >
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-volt">{project.index}</span>
              <span>{project.role}</span>
            </div>
            <h2 id={`${project.slug}-title`} className="mt-6 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              {project.title}
            </h2>
            <p className="mt-2 font-serif text-xl italic text-silver">{project.tagline}</p>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {project.tech.map((tech) => (
                <li key={tech} className="rounded-full border border-paper/15 px-3 py-1 text-[11px] text-paper/80">
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton href={project.href} variant="solid">
                View project
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProjectList() {
  return (
    <section aria-label="Projects" className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-28 md:px-10">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </section>
  )
}
