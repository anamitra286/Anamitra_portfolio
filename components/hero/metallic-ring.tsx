'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { cn } from '@/lib/utils'

function createDotTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export function MetallicRing({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setUnsupported(true)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmall = window.matchMedia('(max-width: 768px)').matches

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const group = new THREE.Group()
    scene.add(group)

    const metal = new THREE.MeshPhysicalMaterial({
      color: 0xdfe1e6,
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.25,
    })
    const brushed = new THREE.MeshPhysicalMaterial({ color: 0xb9bcc6, metalness: 1, roughness: 0.38, envMapIntensity: 1 })

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.13, 96, 360), metal)
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.014, 16, 360), brushed)
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.008, 12, 360), brushed)
    group.add(ring, halo, inner)

    const blue = new THREE.PointLight(0x6f86ff, 40, 20)
    blue.position.set(-4, 2.5, 3)
    const violet = new THREE.PointLight(0x9d7cff, 30, 20)
    violet.position.set(4, -2.5, 2.5)
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(2, 4, 5)
    scene.add(blue, violet, key)

    const count = isSmall ? 260 : 700
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.6
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const dotTexture = createDotTexture()
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      map: dotTexture,
      color: 0xd6dbff,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

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

    const pointer = { x: 0, y: 0 }
    const smooth = { x: 0, y: 0 }
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const clock = new THREE.Clock()
    let running = false
    let frame = 0

    const renderFrame = () => {
      const t = clock.getElapsedTime()
      smooth.x += (pointer.x - smooth.x) * 0.04
      smooth.y += (pointer.y - smooth.y) * 0.04

      ring.rotation.x = 0.9 + Math.sin(t * 0.25) * 0.5
      ring.rotation.y = t * 0.32
      ring.rotation.z = t * 0.08
      halo.rotation.x = 1.2 - t * 0.12
      halo.rotation.y = -t * 0.18
      inner.rotation.x = t * 0.22
      inner.rotation.y = 0.6 + t * 0.15

      group.rotation.y = smooth.x * 0.35
      group.rotation.x = smooth.y * 0.25
      group.position.x = smooth.x * 0.15
      group.position.y = -smooth.y * 0.15

      particles.rotation.y = t * 0.03 + smooth.x * 0.2
      particles.rotation.x = smooth.y * 0.1

      blue.position.x = -4 + Math.sin(t * 0.5) * 1.5
      violet.position.y = -2.5 + Math.cos(t * 0.4) * 1.5

      renderer.render(scene, camera)
    }

    const loop = () => {
      if (!running) return
      renderFrame()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduceMotion) return
      running = true
      clock.start()
      loop()
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    renderFrame()
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(mount)

    return () => {
      stop()
      visibility.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      ring.geometry.dispose()
      halo.geometry.dispose()
      inner.geometry.dispose()
      metal.dispose()
      brushed.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      dotTexture.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div ref={mountRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {unsupported && (
        <div className="absolute inset-[8%] rounded-full border-[10px] border-silver/40 shadow-[0_0_80px_rgb(125_140_255/0.25),inset_0_0_40px_rgb(255_255_255/0.08)]" />
      )}
    </div>
  )
}
