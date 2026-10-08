"use client"

/** Small decorative venue model with a restrained cursor-following tilt. */
// A low, wide two-wing venue with a bright glass entrance atrium.
// Fine mullions, glowing entrance doors and a welcoming approach.
// Small trees and planters give the miniature a sense of scale.

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { tourUrl } from "../lib/navigation"
export function VirtualCardPreview() {
  const canvasHost = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const host = canvasHost.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-9, 9, 6.7, -6.7, 0.1, 100)
    camera.position.set(14, 12, 19)
    camera.lookAt(0, 1, 0)
    scene.add(new THREE.HemisphereLight("#fff6dc", "#233d34", 2.6))
    const sun = new THREE.DirectionalLight("#ffe3ae", 3.8)
    sun.position.set(-8, 15, 12)
    scene.add(sun)

    const venue = new THREE.Group()
    scene.add(venue)
    const mat = (color: string, roughness = 0.65, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness })
    const materials = {
      grass: mat("#425e4d"),
      base: mat("#d6d0be"),
      wall: mat("#ede7d8"),
      trim: mat("#c0a578", 0.43, 0.2),
      glass: mat("#29483f", 0.28, 0.25),
      roof: mat("#b9ad95"),
      path: mat("#c8bea8"),
      leaf: mat("#839073"),
      trunk: mat("#806446"),
      warm: mat("#e6b96c", 0.35, 0.25),
    }
    const block = (
      parent: THREE.Object3D,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      material: THREE.Material,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    block(venue, 0, -0.18, 0, 16, 0.36, 14, materials.grass)
    block(venue, 0, 0.06, 0, 12.8, 0.16, 10.5, materials.base)
    block(venue, -2.6, 1.15, -0.4, 6.3, 2.15, 7.1, materials.wall)
    block(venue, 3, 1.12, -0.25, 5.7, 2.08, 7.4, materials.wall)
    block(venue, 0, 1.45, 3.05, 5.2, 2.7, 2.7, materials.glass)
    block(venue, 0, 2.88, 3.05, 5.65, 0.16, 3.15, materials.trim)
    block(venue, -2.6, 2.31, -0.45, 6.65, 0.2, 7.5, materials.roof)
    block(venue, 3, 2.25, -0.3, 6, 0.2, 7.8, materials.roof)
    for (const x of [-2.25, -1.12, 0, 1.12, 2.25])
      block(venue, x, 1.38, 4.43, 0.075, 2.35, 0.07, materials.trim)
    block(venue, 0, 0.15, 5.2, 3.8, 0.13, 2, materials.path)
    block(venue, -0.58, 1.12, 4.48, 0.82, 1.9, 0.08, materials.warm)
    block(venue, 0.58, 1.12, 4.48, 0.82, 1.9, 0.08, materials.warm)
    for (const x of [-4.7, -3.65, -2.6, -1.55, 1.55, 2.6, 3.65, 4.7]) {
      block(venue, x, 1.35, 3.24, 0.09, 1.75, 0.08, materials.trim)
      block(venue, x, 1.35, -3.95, 0.09, 1.5, 0.08, materials.trim)
    }
    for (const [x, z] of [
      [-6.3, 4.9],
      [6.2, 4.9],
      [-6.1, -4.9],
      [6.3, -4.7],
      [0, -5.35],
    ] as const) {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.12, 1.2, 7),
        materials.trunk,
      )
      trunk.position.set(x, 0.68, z)
      venue.add(trunk)
      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.69, 1),
        materials.leaf,
      )
      crown.position.set(x, 1.48, z)
      crown.scale.set(0.93, 1.15, 0.93)
      crown.castShadow = true
      venue.add(crown)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0,
      running = true,
      visible = false
    const render = (time: number) => {
      frame = 0
      if (!running || !visible || document.hidden) return
      if (!reduced.matches) venue.rotation.y = Math.sin(time * 0.00015) * 0.085
      renderer.render(scene, camera)
      if (!reduced.matches) frame = requestAnimationFrame(render)
    }
    const resume = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(render)
    }
    const resize = () => {
      const width = host.clientWidth,
        height = host.clientHeight
      if (!width || !height) return
      const aspect = width / height,
        viewHeight = 13.5
      camera.left = (-viewHeight * aspect) / 2
      camera.right = (viewHeight * aspect) / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      resume()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) resume()
        else {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: "100px" },
    )
    visibilityObserver.observe(host)
    const handleMotionChange = () => {
      if (reduced.matches) venue.rotation.y = 0
      cancelAnimationFrame(frame)
      frame = 0
      resume()
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else resume()
    }
    reduced.addEventListener("change", handleMotionChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibilityObserver.disconnect()
      reduced.removeEventListener("change", handleMotionChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose()
      })
      Object.values(materials).forEach((material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  function pointCard(clientX: number, clientY: number) {
    const node = card.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height
    node.style.setProperty("--card-x", `${x * 100}%`)
    node.style.setProperty("--card-y", `${y * 100}%`)
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`)
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`)
    node.classList.add("is-tilting")
  }

  function resetCard() {
    const node = card.current
    if (!node) return
    node.style.setProperty("--tilt-x", "0deg")
    node.style.setProperty("--tilt-y", "0deg")
    node.classList.remove("is-tilting")
  }

  return (
    <a
      ref={card}
      href={tourUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir experiencia virtual 360 en una pestaña nueva"
      className="virtual-invite-art"
      onPointerMove={(event) => {
        if (
          event.pointerType !== "touch" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          pointCard(event.clientX, event.clientY)
      }}
      onPointerLeave={resetCard}
      onBlur={resetCard}
    >
      <div
        className="virtual-art-orbit virtual-art-orbit-a"
        aria-hidden="true"
      />
      <div
        className="virtual-art-orbit virtual-art-orbit-b"
        aria-hidden="true"
      />
      <div
        className="virtual-art-orbit virtual-art-orbit-c"
        aria-hidden="true"
      />
      <div className="virtual-art-model" ref={canvasHost} aria-hidden="true" />
      <div className="virtual-art-stamp" aria-hidden="true">
        <span>360</span>
        <sup>°</sup>
      </div>
      <div className="virtual-art-coordinates" aria-hidden="true">
        <span>MODELO ESPACIAL / 01</span>
        <span>MANTA · ECUADOR</span>
      </div>
      <div className="virtual-art-footer" aria-hidden="true">
        <span>UN CENTRO POR DESCUBRIR</span>
        <span>
          VISTA INTERACTIVA <i />
        </span>
      </div>
    </a>
  )
}
