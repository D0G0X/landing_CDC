"use client"

import { useEffect, useRef, useState } from "react"
import { homeUrl } from "../lib/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Maximize,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  Play,
  Pause,
  Move,
  X,
} from "lucide-react"
import * as THREE from "three"
import { createConventionScene, stops } from "../lib/convention-scene"

export function VirtualTour() {
  const host = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const engine = useRef<{
    go: (i: number) => void
    zoom: (n: number) => void
    reset: () => void
    auto: boolean
  } | null>(null)
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState("loading")
  const [auto, setAuto] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [help, setHelp] = useState(true)
  const [notice, setNotice] = useState("")
  const stop = stops[active]

  useEffect(() => {
    const container = host.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "low-power",
      })
    } catch {
      const failedFrame = requestAnimationFrame(() => setStatus("error"))
      return () => cancelAnimationFrame(failedFrame)
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    const model = createConventionScene()
    const camera = new THREE.PerspectiveCamera(70, 1, 0.08, 120)
    camera.position.set(0, 1.65, 6)
    camera.rotation.order = "YXZ"
    let yaw = 0,
      pitch = 0,
      selected = 0,
      pointer: number | null = null,
      lastX = 0,
      lastY = 0
    let running = true,
      previous = 0
    const keys = new Set<string>()
    const api = {
      auto: false,
      go(i: number) {
        selected = i
        const s = stops[i]
        camera.position.set(s.x, 1.65, s.z)
        yaw = s.yaw
        pitch = 0
        camera.fov = 70
        camera.updateProjectionMatrix()
      },
      zoom(n: number) {
        camera.fov = THREE.MathUtils.clamp(camera.fov + n, 40, 95)
        camera.updateProjectionMatrix()
      },
      reset() {
        api.go(selected)
      },
    }
    engine.current = api
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    const down = (e: PointerEvent) => {
      if (!e.isPrimary) return
      pointer = e.pointerId
      lastX = e.clientX
      lastY = e.clientY
      container.setPointerCapture(e.pointerId)
      container.focus()
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return
      yaw -= (e.clientX - lastX) * 0.004
      pitch -= (e.clientY - lastY) * 0.004
      lastX = e.clientX
      lastY = e.clientY
    }
    const up = () => {
      pointer = null
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      api.zoom(e.deltaY * 0.03)
    }
    const keydown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "=",
        ].includes(e.key)
      ) {
        e.preventDefault()
        keys.add(e.key)
      }
    }
    const keyup = (e: KeyboardEvent) => keys.delete(e.key)
    const blur = () => {
      keys.clear()
      pointer = null
    }
    const contextLost = (e: Event) => {
      e.preventDefault()
      setStatus("error")
      running = false
    }
    const fs = () => setFullscreen(document.fullscreenElement === stage.current)
    container.addEventListener("pointerdown", down)
    container.addEventListener("pointermove", move)
    container.addEventListener("pointerup", up)
    container.addEventListener("pointercancel", up)
    container.addEventListener("lostpointercapture", up)
    container.addEventListener("wheel", wheel, { passive: false })
    container.addEventListener("keydown", keydown)
    container.addEventListener("keyup", keyup)
    container.addEventListener("blur", blur)
    renderer.domElement.addEventListener("webglcontextlost", contextLost)
    document.addEventListener("fullscreenchange", fs)
    window.addEventListener("blur", blur)
    let frame = 0,
      firstFrame = true
    const render = (time: number) => {
      if (!running) return
      const dt = Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (!document.hidden) {
        if (api.auto && pointer === null) yaw -= dt * 0.12
        if (keys.has("ArrowLeft")) yaw += dt
        if (keys.has("ArrowRight")) yaw -= dt
        if (keys.has("ArrowUp")) pitch += dt
        if (keys.has("ArrowDown")) pitch -= dt
        if (keys.has("+") || keys.has("=")) api.zoom(-dt * 25)
        if (keys.has("-")) api.zoom(dt * 25)
        pitch = THREE.MathUtils.clamp(pitch, -1.35, 1.35)
        camera.rotation.set(pitch, yaw, 0)
        renderer.render(model.scene, camera)
        if (firstFrame) {
          firstFrame = false
          setStatus("ready")
        }
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      engine.current = null
      container.removeEventListener("pointerdown", down)
      container.removeEventListener("pointermove", move)
      container.removeEventListener("pointerup", up)
      container.removeEventListener("pointercancel", up)
      container.removeEventListener("lostpointercapture", up)
      container.removeEventListener("wheel", wheel)
      container.removeEventListener("keydown", keydown)
      container.removeEventListener("keyup", keyup)
      container.removeEventListener("blur", blur)
      renderer.domElement.removeEventListener("webglcontextlost", contextLost)
      document.removeEventListener("fullscreenchange", fs)
      window.removeEventListener("blur", blur)
      model.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  function visit(i: number) {
    engine.current?.go(i)
    setActive(i)
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (stage.current?.requestFullscreen)
        await stage.current.requestFullscreen()
      else
        setNotice(
          "Tu navegador no admite pantalla completa. Puedes recorrer todos los espacios en esta vista.",
        )
    } catch {
      setNotice(
        "No se pudo abrir la pantalla completa. El recorrido sigue disponible aquí.",
      )
    }
  }
  return (
    <main className="tour-page">
      <header className="tour-header">
        <a href={`${homeUrl}#recorrido-virtual`} className="tour-back">
          <ArrowLeft size={17} /> Volver al inicio
        </a>
        <span className="tour-brand">
          CCU<span>.</span> <small>ESPACIOS PARA ENCONTRARNOS</small>
        </span>
        <span className="tour-edition">EXPERIENCIA VIRTUAL / 01</span>
      </header>
      <div className="tour-title-row">
        <div>
          <span className="eyebrow">UN PRIMER VISTAZO AL FUTURO</span>
          <h1>
            Entra. Mira. <em>Imagina.</em>
          </h1>
        </div>
        <p>
          Un pequeño centro, grandes posibilidades.
          <br />
          Descubre nuestro espacio conceptual en 360°.
        </p>
      </div>
      <div className="tour-layout">
        <section
          className="tour-stage"
          ref={stage}
          aria-label="Recorrido virtual interactivo"
        >
          <div
            ref={host}
            className="tour-canvas"
            tabIndex={0}
            role="region"
            aria-label={`Vista 360 de ${stop.name}. Arrastra para mirar, usa las flechas para girar y los botones de espacios para desplazarte.`}
            aria-describedby="tour-instructions"
          />
          <div className="tour-scene-label">
            <span className="tour-live-dot" /> MODELO 3D · 360°
          </div>
          <div className="tour-location">
            <span>ESTÁS EN</span>
            <strong>{stop.name}</strong>
          </div>
          {status !== "ready" && (
            <div className="tour-loading" role="status">
              <Compass size={36} />
              <h2>
                {status === "error"
                  ? "La vista 3D no está disponible"
                  : "Preparando tu visita…"}
              </h2>
              <p>
                {status === "error"
                  ? "Activa la aceleración gráfica o prueba otro navegador. Puedes consultar los espacios en el panel."
                  : "Abriendo las puertas del centro."}
              </p>
              {status === "error" && (
                <button onClick={() => window.location.reload()}>
                  Volver a intentar
                </button>
              )}
            </div>
          )}
          {help && status === "ready" && (
            <div className="tour-hint">
              <Move size={21} />
              <span>
                El espacio está a tu alrededor.
                <small>
                  Arrastra para mirar · Elige una parada para avanzar
                </small>
              </span>
              <button
                aria-label="Cerrar indicaciones"
                onClick={() => setHelp(false)}
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="tour-controls" aria-label="Controles de la vista">
            <button
              disabled={status !== "ready"}
              aria-label={
                auto ? "Pausar giro automático" : "Activar giro automático"
              }
              aria-pressed={auto}
              onClick={() => {
                if (engine.current) engine.current.auto = !auto
                setAuto(!auto)
              }}
            >
              {auto ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <span />
            <button
              disabled={status !== "ready"}
              aria-label="Acercar"
              onClick={() => engine.current?.zoom(-8)}
            >
              <Plus size={19} />
            </button>
            <button
              disabled={status !== "ready"}
              aria-label="Alejar"
              onClick={() => engine.current?.zoom(8)}
            >
              <Minus size={19} />
            </button>
            <button
              disabled={status !== "ready"}
              aria-label="Restablecer vista"
              onClick={() => engine.current?.reset()}
            >
              <RotateCcw size={17} />
            </button>
            <span />
            <button
              aria-label={
                fullscreen ? "Salir de pantalla completa" : "Pantalla completa"
              }
              onClick={toggleFullscreen}
            >
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
          <div className="tour-next">
            <button
              disabled={status !== "ready"}
              onClick={() => visit((active + 1) % stops.length)}
            >
              Ir a {stops[(active + 1) % stops.length].name}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
          {notice && (
            <p className="tour-notice" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Cerrar aviso">
                <X size={14} />
              </button>
            </p>
          )}
        </section>
        <aside className="tour-sidebar">
          <div className="tour-sidebar-heading">
            <span className="eyebrow">EXPLORA EL CENTRO</span>
            <span>0{active + 1} / 04</span>
          </div>
          <div className="tour-stops">
            {stops.map((s, i) => (
              <button
                key={s.name}
                onClick={() => visit(i)}
                aria-pressed={active === i}
                className={active === i ? "is-active" : ""}
              >
                <span>0{i + 1}</span>
                <span>
                  {s.name}
                  <small>{s.tag}</small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
          <div className="tour-detail" aria-live="polite">
            <h2>{stop.subtitle}</h2>
            <p>{stop.description}</p>
          </div>
          <div className="tour-map">
            <div className="eyebrow">
              TU UBICACIÓN <Compass size={14} />
            </div>
            <div className="tour-floorplan">
              {stops.map((s, i) => (
                <button
                  key={s.name}
                  className={`map-room map-room-${i} ${
                    active === i ? "is-active" : ""
                  }`}
                  onClick={() => visit(i)}
                  aria-label={`Ir a ${s.name}`}
                  aria-pressed={active === i}
                >
                  <span>0{i + 1}</span>
                  {s.name}
                </button>
              ))}
            </div>
            <small>PLANO ESQUEMÁTICO · SIN ESCALA</small>
          </div>
        </aside>
      </div>
      <footer className="tour-footer">
        <p id="tour-instructions">
          Arrastra o desliza para mirar alrededor. También puedes usar las
          flechas del teclado al enfocar la vista.
        </p>
        <span>PROTOTIPO FICTICIO · NO REPRESENTA LAS INSTALACIONES REALES</span>
      </footer>
    </main>
  )
}
