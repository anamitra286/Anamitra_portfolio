'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type ParticleFieldProps = {
  className?: string
  count?: number
}

/**
 * A 3D cloud of particles that drifts slowly and parts around the cursor,
 * then settles back. Falls back to nothing if WebGPU/WebGL is unavailable.
 */
export function ParticleField({ className, count = 5000 }: ParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      try {
        const THREE = await import('three/webgpu')
        const TSL = await import('three/tsl')
        if (disposed) return

        const renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true })
        await renderer.init()
        if (disposed) {
          renderer.dispose()
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        mount.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 0, 6.5)

        // Points spread over a noisy sphere so the shape reads as a 3D volume.
        const positions = new Float32Array(count * 3)
        const seeds = new Float32Array(count)
        for (let i = 0; i < count; i++) {
          const u = Math.random() * 2 - 1
          const theta = Math.random() * Math.PI * 2
          const r = 1.9 + (Math.random() - 0.5) * 0.5
          const s = Math.sqrt(1 - u * u)
          positions[i * 3] = r * s * Math.cos(theta)
          positions[i * 3 + 1] = r * s * Math.sin(theta)
          positions[i * 3 + 2] = r * u
          seeds[i] = Math.random()
        }
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))

        const uPointer = TSL.uniform(new THREE.Vector3(99, 99, 99))
        const seed = TSL.attribute('seed', 'float') as unknown as ReturnType<typeof TSL.float>
        const base = TSL.attribute('position', 'vec3') as unknown as ReturnType<typeof TSL.vec3>

        // Gentle drift over time, plus a push away from the cursor.
        const t = TSL.time.mul(0.5)
        const phase = seed.mul(6.2831)
        const drift = TSL.vec3(
          TSL.sin(t.add(phase)).mul(0.04),
          TSL.cos(t.mul(1.3).add(phase)).mul(0.04),
          TSL.sin(t.mul(0.7).add(phase.mul(2))).mul(0.04),
        )
        const toPointer = base.sub(uPointer)
        const pointerDist = TSL.length(toPointer)
        const push = TSL.smoothstep(1.6, 0, pointerDist).mul(0.9)
        const displaced = base.add(TSL.normalize(toPointer).mul(push)).add(drift)

        const material = new THREE.PointsNodeMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: false,
        })
        material.positionNode = displaced

        const centered = TSL.pointUV.sub(0.5)
        const disc = TSL.smoothstep(0.5, 0.0, TSL.length(centered))
        const cool = TSL.color(0x7d8cff)
        const silver = TSL.color(0xe6e8ef)
        material.colorNode = TSL.mix(cool, silver, seed.add(push.mul(1.2)).clamp(0, 1))
        material.opacityNode = disc.pow(2.2).mul(seed.mul(0.5).add(0.4)).mul(TSL.smoothstep(0, 1.2, push.add(0.25)))
        material.sizeNode = seed.mul(1.8).add(2).add(push.mul(3))

        const points = new THREE.Points(geometry, material)
        points.frustumCulled = false
        const group = new THREE.Group()
        group.add(points)
        scene.add(group)

        const resize = () => {
          const { clientWidth, clientHeight } = mount
          if (!clientWidth || !clientHeight) return
          renderer.setSize(clientWidth, clientHeight, false)
          camera.aspect = clientWidth / clientHeight
          camera.updateProjectionMatrix()
        }
        resize()
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(mount)

        const ndc = new THREE.Vector2(99, 99)
        const targetPointer = new THREE.Vector3(99, 99, 99)
        const raycaster = new THREE.Raycaster()
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        const hit = new THREE.Vector3()
        const onPointer = (event: PointerEvent) => {
          const rect = mount.getBoundingClientRect()
          ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
          raycaster.setFromCamera(ndc, camera)
          if (raycaster.ray.intersectPlane(plane, hit)) {
            targetPointer.copy(group.worldToLocal(hit.clone()))
          }
        }
        const onLeave = () => targetPointer.set(99, 99, 99)
        window.addEventListener('pointermove', onPointer, { passive: true })
        mount.addEventListener('pointerleave', onLeave)

        let running = false
        let rotY = 0
        const tick = () => {
          const elapsed = performance.now() / 1000
          rotY += 0.0018
          group.rotation.y = rotY + ndc.x * 0.3
          group.rotation.x = Math.sin(elapsed * 0.25) * 0.12 + ndc.y * -0.2
          uPointer.value.lerp(targetPointer, 0.1)
          renderer.render(scene, camera)
        }

        const start = () => {
          if (running) return
          running = true
          renderer.setAnimationLoop(tick)
        }
        const stop = () => {
          running = false
          renderer.setAnimationLoop(null)
        }

        tick()
        const visibility = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start()
          else stop()
        })
        visibility.observe(mount)

        cleanup = () => {
          stop()
          visibility.disconnect()
          resizeObserver.disconnect()
          window.removeEventListener('pointermove', onPointer)
          mount.removeEventListener('pointerleave', onLeave)
          geometry.dispose()
          material.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch (error) {
        console.log('[v0] Particle field unavailable:', error)
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [count])

  return <div ref={mountRef} className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true" />
}
