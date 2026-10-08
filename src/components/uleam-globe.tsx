"use client"

// These arcs illustrate an international reach; they are not announced routes or events.

import { useEffect, useRef, useState } from "react"
import createGlobe, { type Arc, type Globe, type Marker } from "cobe"
import { ArrowUpRight } from "lucide-react"

const manta: [number, number] = [-0.95267, -80.74528]
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Universidad%20Laica%20Eloy%20Alfaro%20de%20Manab%C3%AD%2C%20Av.%20Circunvalaci%C3%B3n%2C%20V%C3%ADa%20San%20Mateo%2C%20Manta%2C%20Ecuador"
const origins: { name: string; location: [number, number] }[] = [
  { name: "Ciudad de México", location: [19.4326, -99.1332] },
  { name: "Nueva York", location: [40.7128, -74.006] },
  { name: "Madrid", location: [40.4168, -3.7038] },
  { name: "São Paulo", location: [-23.5505, -46.6333] },
  { name: "Buenos Aires", location: [-34.6037, -58.3816] },
  { name: "Vancouver", location: [49.2827, -123.1207] },
]

const markers: Marker[] = [
  { location: manta, size: 0.095, id: "manta", color: [1, 1, 1] },
  ...origins.map(({ location }) => ({ location, size: 0.025 })),
]

const arcs: Arc[] = origins.map(({ location }) => ({
  from: location,
  to: manta,
}))

export function UleamGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotation = useRef(0)
  const dragging = useRef(false)
  const lastPointerX = useRef(0)
  const paused = useRef(false)
  const inView = useRef(false)
  const drawOnInteraction = useRef<() => void>(() => {})
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    let globe: Globe | null = null
    let frame = 0

    const draw = () => {
      if (!globe) return
      if (!document.hidden && (inView.current || reducedMotion)) {
        if (!reducedMotion && !dragging.current && !paused.current)
          rotation.current += 0.0016
        globe.update({ phi: rotation.current, theta: 0.13 })
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }
    drawOnInteraction.current = () =>
      globe?.update({ phi: rotation.current, theta: 0.13 })

    const resize = () => {
      const size = Math.round(canvas.getBoundingClientRect().width)
      if (!size) return
      if (globe) {
        globe.update({ width: size, height: size })
        if (reducedMotion) draw()
        return
      }

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width: size,
          height: size,
          phi: 0,
          theta: 0.13,
          dark: 1,
          diffuse: 1.35,
          mapSamples: 16000,
          mapBrightness: 7,
          mapBaseBrightness: 0,
          baseColor: [0.11, 0.11, 0.11],
          markerColor: [1, 1, 1],
          glowColor: [0.18, 0.18, 0.18],
          arcColor: [0.78, 0.78, 0.78],
          arcWidth: 0.42,
          arcHeight: 0.32,
          markerElevation: 0.03,
          markers,
          arcs,
        })
      } catch {
        setUnavailable(true)
        return
      }
      draw()
    }

    const observer = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
      },
      { rootMargin: "150px" },
    )
    observer.observe(canvas)
    visibilityObserver.observe(canvas)
    resize()

    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
      cancelAnimationFrame(frame)
      globe?.destroy()
      drawOnInteraction.current = () => {}
    }
  }, [])

  const stopDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      className="uleam-globe-wrap"
      onMouseEnter={() => {
        paused.current = true
      }}
      onMouseLeave={() => {
        paused.current = false
      }}
      onFocusCapture={() => {
        paused.current = true
      }}
      onBlurCapture={() => {
        paused.current = false
      }}
    >
      <div className="globe-kicker" aria-hidden="true">
        <span>DESDE MANTA</span>
        <span>HACIA EL MUNDO</span>
      </div>
      <div className="globe-stage">
        <canvas
          ref={canvasRef}
          className="globe-canvas"
          tabIndex={0}
          role="img"
          aria-label="Globo terráqueo con conexiones ilustrativas hacia Manta, Ecuador. Arrastra o usa las flechas izquierda y derecha para girarlo."
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            rotation.current += event.key === "ArrowLeft" ? -0.12 : 0.12
            drawOnInteraction.current()
          }}
          onPointerDown={(event) => {
            if (!event.isPrimary) return
            dragging.current = true
            lastPointerX.current = event.clientX
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return
            rotation.current += (event.clientX - lastPointerX.current) / 220
            lastPointerX.current = event.clientX
            drawOnInteraction.current()
          }}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        />
        {unavailable && (
          <p className="globe-fallback" role="status">
            Manta, Ecuador · Un punto de encuentro conectado al mundo.
          </p>
        )}
        <a
          className="manta-marker"
          href={mapsUrl}
          aria-label="Ver Universidad Laica Eloy Alfaro de Manabí en Google Maps"
        >
          <span className="manta-marker-dot" aria-hidden="true" />
          <span className="manta-marker-label">
            ULEAM <small>MANTA · ECUADOR</small>
          </span>
        </a>
      </div>
      <div className="globe-caption">
        <span>
          UNA VISIÓN CONECTADA AL MUNDO <i>·</i> CONEXIONES ILUSTRATIVAS
          <span className="sr-only">
            {" "}
            desde México, Estados Unidos, España, Brasil, Argentina y Canadá
            hasta Manta.
          </span>
        </span>
        <a href={mapsUrl}>
          VER UBICACIÓN <ArrowUpRight size={15} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  )
}
