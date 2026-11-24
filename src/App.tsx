import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { UleamGlobe } from "./components/uleam-globe"
import { ReviewMarquee } from "./components/review-marquee"
import { tourUrl } from "./lib/navigation"
import { useHeroStory } from "./lib/use-hero-story"
import heroImage from "./assets/galeria_uleam11.jpg"
import galleryImage1 from "./assets/galeria_uleam1.jpg"
import galleryImage2 from "./assets/galeria_uleam2.jpg"
import galleryImage3 from "./assets/galeria_uleam3.jpg"
import galleryImage4 from "./assets/galeria_uleam4.jpg"
import galleryImage5 from "./assets/galeria_uleam5.jpg"
import galleryImage6 from "./assets/galeria_uleam6.jpg"
import galleryImage7 from "./assets/galeria_uleam7.jpg"
import galleryImage8 from "./assets/galeria_uleam8.jpg"
import galleryImage9 from "./assets/galeria_uleam9.jpg"
import galleryImage10 from "./assets/galeria_uleam10.jpg"
import galleryImage11 from "./assets/galeria_uleam11.jpg"
import galleryImage12 from "./assets/galeria_uleam12.jpg"
import galleryImage13 from "./assets/galeria_uleam13.jpg"
import galleryImage14 from "./assets/galeria_uleam14.jpg"
import galleryImage15 from "./assets/galeria_uleam15.jpg"
import galleryImage16 from "./assets/galeria_uleam16.jpg"
import projectFilm from "./assets/uleam-project-film-new.mp4"
import logoCcp from "./assets/logo-ccp.png"
import eventEntranceImage from "./assets/evento-gastronomia-entrada.jpg"
import eventVendorsImage from "./assets/evento-gastronomia-puestos.jpg"
import eventChefImage from "./assets/evento-gastronomia-chef.jpg"
import eventCacaoImage from "./assets/evento-gastronomia-cacao.jpg"

const VirtualCardPreview = lazy(() =>
  import("./components/virtual-card-preview").then((module) => ({
    default: module.VirtualCardPreview,
  })),
)
const images = {
  hero: heroImage,
  hall: galleryImage1,
  service:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
  experience:
    "https://images.unsplash.com/photo-1651313948618-31644c7fec18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
  event:
    "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1400",
}
const navigation = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Espacios", href: "#espacios" },
  { label: "Proyecto", href: "#proyecto" },
  { label: "Video", href: "#video" },
  { label: "Recorrido 360°", href: "#recorrido-virtual" },
  { label: "Servicios", href: "#servicios" },
  { label: "Historias", href: "#resenas" },
]
const slides = [
  {
    kicker: "Congresos & conferencias",
    title: "Ideas que convocan.",
    text: "Un escenario para compartir conocimiento, abrir conversaciones y mirar más lejos. Dale a tu próxima conferencia el espacio que merece.",
    image: images.hall,
    alt: "Interior amplio de un salón de convenciones",
  },
  {
    kicker: "Encuentros & celebraciones",
    title: "Momentos que reúnen.",
    text: "Hay ocasiones que merecen vivirse juntos. Imagina una celebración con una atmósfera propia y cada detalle pensado para tus invitados.",
    image: galleryImage2,
    alt: "Vista del proyecto del Centro de Convenciones ULEAM",
  },
  {
    kicker: "Eventos corporativos",
    title: "Conexiones que crecen.",
    text: "Reúne a tu equipo, presenta lo que viene o inicia una nueva alianza. Cada formato encuentra aquí una posibilidad.",
    image: galleryImage3,
    alt: "Vista del proyecto del Centro de Convenciones ULEAM",
  },
]
const projectImages = [
  galleryImage1, galleryImage2, galleryImage3, galleryImage4, galleryImage5,
  galleryImage6, galleryImage7, galleryImage8, galleryImage9, galleryImage10,
  galleryImage11, galleryImage12, galleryImage13, galleryImage14, galleryImage15,
  galleryImage16,
].map((src, index) => ({
  src,
  alt: `Vista ${index + 1} del proyecto del Centro de Convenciones ULEAM`,
  caption: "Centro de Convenciones ULEAM",
}))
const archivedEvents = [
  {
    id: "cumbre-gastronomica-2026",
    category: "Cumbre mundial · Gastronomía",
    title: "II Cumbre Mundial Gastronómica 2026",
    description:
      "Sabores, saberes y encuentros que celebran la gastronomía de Manabí. Un registro de las actividades y las personas que dieron vida a esta edición.",
    date: "Edición 2026 · día por confirmar",
    location: "Centro de Convenciones ULEAM · Manta",
    cover: eventEntranceImage,
    coverAlt: "Ingreso a la II Cumbre Mundial Gastronómica en el Centro de Convenciones ULEAM",
    gallery: [
      { src: eventEntranceImage, alt: "Ingreso de la Cumbre Mundial Gastronómica", caption: "La bienvenida a la Cumbre" },
      { src: eventVendorsImage, alt: "Expositores presentan sus productos gastronómicos", caption: "Expositores y sabores" },
      { src: eventChefImage, alt: "Demostración culinaria durante la Cumbre", caption: "Demostraciones culinarias" },
      { src: eventCacaoImage, alt: "Muestra de cacao y productos tradicionales de Manabí", caption: "Cacao y tradición manabita" },
    ],
  },
]
const services = [
  {
    title: "Un espacio a tu medida",
    text: "Partimos de tu idea para pensar el formato, la distribución y la atmósfera de tu encuentro.",
    tag: "VERSATILIDAD",
  },
  {
    title: "Cada detalle, conectado",
    text: "Coordinamos las necesidades de producción y equipamiento para que tu mensaje llegue con claridad.",
    tag: "PRODUCCIÓN",
  },
  {
    title: "Un equipo a tu lado",
    text: "Te acompañamos desde la primera conversación hasta el momento de recibir a tus invitados.",
    tag: "ACOMPAÑAMIENTO",
  },
]
function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`arrow-icon${down ? " arrow-down" : ""}`}
    >
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  )
}
function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label="CCU, ir al inicio">
      <img
        src={logoCcp}
        alt="Centro de Convenciones del Pacífico"
        className="brand-logo"
      />
    </a>
  )
}
function Chapter({
  number,
  label,
  note,
}: {
  number: string
  label: string
  note?: string
}) {
  return (
    <div className="chapter">
      <span>
        <b>{number}</b>
        {label}
      </span>
      {note && <span className="chapter-note">{note}</span>}
    </div>
  )
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)
  const [activeEvent, setActiveEvent] = useState<(typeof archivedEvents)[number] | null>(null)
  const [activeEventPhoto, setActiveEventPhoto] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  useHeroStory(heroRef)
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let timer: number | undefined
    const sync = () => {
      window.clearInterval(timer)
      if (!motion.matches && !sliderPaused)
        timer = window.setInterval(
          () => setActiveSlide((current) => (current + 1) % slides.length),
          6500,
        )
    }
    sync()
    motion.addEventListener("change", sync)
    return () => {
      window.clearInterval(timer)
      motion.removeEventListener("change", sync)
    }
  }, [sliderPaused])
  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [menuOpen])
  useEffect(() => {
    if (!activeEvent) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveEvent(null)
    }
    window.addEventListener("keydown", close)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", close)
    }
  }, [activeEvent])
  const goToSlide = (next: number) =>
    setActiveSlide((next + slides.length) % slides.length)
  const slide = slides[activeSlide]
  return (
    <div className="landing-page">
      <a href="#nosotros" className="skip-link">
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="landing-shell header-inner">
          <Brand />
          <nav aria-label="Navegación principal" className="desktop-nav">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a href="#cotizar" className="header-cta">
              Hablemos <Arrow />
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Navegación móvil"
            className="mobile-nav"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <Arrow />
              </a>
            ))}
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              Contacto
              <Arrow />
            </a>
          </nav>
        )}
      </header>
      <main>
        <section
          id="inicio"
          className="story-hero"
          ref={heroRef}
          aria-labelledby="hero-title"
        >
          <div className="hero-stage">
            <img
              src={images.hero}
              alt="Vista exterior del Centro de Convenciones ULEAM con su plaza y jardines"
              className="hero-scene-image"
              fetchPriority="high"
            />
            <div className="hero-scene-shade" />
            <div className="hero-scene-vignette" />
            <div className="hero-copy landing-shell">
              <p className="hero-eyebrow">
                <span />
                Manta, Ecuador · Centro de Convenciones ULEAM
              </p>
              <h1 id="hero-title">
                <span>El escenario</span>
                <span className="hero-outline">de tus ideas.</span>
              </h1>
              <div className="hero-copy-bottom">
                <p>
                  Las grandes ideas necesitan un lugar.
                  <br />
                  Los grandes encuentros empiezan aquí.
                </p>
                <div className="hero-actions">
                  <a href="#cotizar" className="button-primary">
                    Crear mi evento <Arrow />
                  </a>
                  <a href="#recorrido-virtual" className="hero-text-link">
                    Descubrir el espacio <Arrow />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-story landing-shell" aria-hidden="true">
              <p className="hero-eyebrow">
                <span />
                Todo empieza cuando nos encontramos
              </p>
              <p className="hero-story-title">
                Una idea.
                <br />
                <em>Un lugar.</em>
                <br />
                Un nuevo comienzo.
              </p>
              <span className="hero-story-caption">
                Tu próxima historia empieza en Manta.
              </span>
            </div>
            <div className="hero-bottom landing-shell">
              <a href="#nosotros" className="hero-scroll">
                Desliza para descubrir{" "}
                <span>
                  <Arrow down />
                </span>
              </a>
              <div className="hero-scene-progress" aria-hidden="true">
                <span className="hero-label-idea">01 — La idea</span>
                <span className="hero-label-encuentro">02 — El encuentro</span>
                <i>
                  <b />
                </i>
              </div>
              <span className="hero-place" aria-hidden="true">
                Un espacio. Todas las posibilidades.
              </span>
            </div>
          </div>
        </section>
        <section
          id="nosotros"
          className="story-intro landing-shell section-space"
          aria-labelledby="intro-title"
        >
          <Chapter
            number="01"
            label="El principio de todo"
            note="De una idea a un encuentro"
          />
          <div className="intro-layout">
            <div className="intro-aside">
              <span className="editorial-symbol" aria-hidden="true">
                ↗
              </span>
              <p>
                Conectar personas.
                <br />
                Dar lugar a lo que viene.
              </p>
            </div>
            <div>
              <h2 id="intro-title" className="story-heading">
                Lo que imaginas
                <br />
                merece <em>un lugar.</em>
              </h2>
              <div className="intro-paragraphs">
                <p>
                  Una conferencia que abre perspectivas. Una celebración que nos
                  reúne. Una conversación que se convierte en un proyecto.
                </p>
                <p>
                  En el Centro de Convenciones ULEAM, pensamos cada encuentro
                  desde lo que importa: las personas, las ideas y lo que pueden
                  crear juntas.
                </p>
              </div>
              <a href="#conexion-global" className="editorial-link">
                Conoce nuestro punto de encuentro <Arrow down />
              </a>
            </div>
          </div>
          <div className="intro-foot">
            <span>Academia · Empresas · Comunidad</span>
            <span>Manta, Manabí — Ecuador</span>
          </div>
        </section>
        <div className="dark-story">
          <section
            id="conexion-global"
            className="landing-shell section-space globe-section"
            aria-labelledby="globe-title"
          >
            <Chapter
              number="02"
              label="El punto de encuentro"
              note="Desde Manta, hacia el mundo"
            />
            <div className="globe-layout">
              <div className="globe-copy">
                <h2 id="globe-title" className="story-heading">
                  Aquí nos reunimos.
                  <br />
                  <em>Más lejos llegamos.</em>
                </h2>
                <p>
                  En el corazón de Manta, un lugar para conectar la universidad,
                  la ciudad y las ideas que vienen de todas partes.
                </p>
                <p className="globe-copy-secondary">
                  Porque el valor de un encuentro no está solo en dónde sucede,
                  sino en las conexiones que deja.
                </p>
                <a href="#espacios" className="editorial-link">
                  Encuentra el escenario para tu idea <Arrow down />
                </a>
              </div>
              <UleamGlobe />
            </div>
          </section>
          <section
            id="espacios"
            className="landing-shell spaces-section section-space"
            aria-labelledby="spaces-title"
          >
            <div className="section-intro">
              <div>
                <p className="eyebrow">
                  Un mismo lugar. Distintas formas de encontrarnos.
                </p>
                <h2 id="spaces-title" className="story-heading">
                  Tu idea cambia.
                  <br />
                  <em>El espacio se adapta.</em>
                </h2>
              </div>
              <p className="section-description">
                Dale forma a lo que tienes en mente. De la primera fila de una
                conferencia al último brindis de una celebración.
              </p>
            </div>
            <div
              className="space-carousel"
              onMouseEnter={() => setSliderPaused(true)}
              onMouseLeave={() => setSliderPaused(false)}
              onFocusCapture={() => setSliderPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setSliderPaused(false)
              }}
              aria-roledescription="carrusel"
              aria-label="Ideas para tu evento"
            >
              <div className="space-image">
                {slides.map((item, index) => (
                  <img
                    key={item.title}
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    aria-hidden={index !== activeSlide}
                    className={index === activeSlide ? "is-active" : ""}
                  />
                ))}
                <div className="space-image-shade" />
                <span className="space-image-index">
                  0{activeSlide + 1}
                  <small> / 03</small>
                </span>
                <span className="space-image-caption">
                  El escenario de tu próximo encuentro
                </span>
              </div>
              <div className="space-copy">
                <div className="space-tabs">
                  {slides.map((item, index) => (
                    <button
                      type="button"
                      key={item.title}
                      aria-label={`Ver ${item.kicker}`}
                      aria-pressed={index === activeSlide}
                      onClick={() => setActiveSlide(index)}
                    >
                      <span>0{index + 1}</span>
                      <i />
                    </button>
                  ))}
                </div>
                <div className="space-slide-text">
                  <p className="eyebrow">{slide.kicker}</p>
                  <h3>{slide.title}</h3>
                  <p>{slide.text}</p>
                </div>
                <div className="space-copy-footer">
                  <a href="#cotizar" className="editorial-link">
                    Hagámoslo posible <Arrow />
                  </a>
                  <div className="space-controls">
                    <button
                      type="button"
                      aria-label="Espacio anterior"
                      onClick={() => goToSlide(activeSlide - 1)}
                    >
                      <span className="arrow-back">
                        <Arrow />
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Espacio siguiente"
                      onClick={() => goToSlide(activeSlide + 1)}
                    >
                      <Arrow />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-bridge">
              <span>Ya puedes imaginarlo.</span>
              <a href="#recorrido-virtual">
                Ahora, entra y descúbrelo. <Arrow down />
              </a>
            </div>
          </section>
        </div>
        <section
          id="proyecto"
          className="landing-shell section-space project-section"
          aria-labelledby="project-title"
        >
          <Chapter number="03" label="Conoce el proyecto" note="Centro de Convenciones ULEAM · Manta" />
          <div className="section-intro">
            <div>
              <p className="eyebrow">Una mirada al espacio</p>
              <h2 id="project-title" className="story-heading">
                Un lugar para
                <br />
                <em>todo lo que viene.</em>
              </h2>
            </div>
            <p className="section-description">
              Recorre en imágenes las vistas interiores y exteriores del proyecto.
            </p>
          </div>
          <div className="project-gallery" aria-label="Galería de imágenes del proyecto">
            {projectImages.map((image, index) => (
              <figure className={`project-gallery-item project-gallery-item-${index + 1}`} key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption><span>0{index + 1}</span>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section id="video" className="project-video-section section-space" aria-labelledby="video-title">
          <div className="landing-shell project-video-inner">
            <Chapter number="04" label="El proyecto en movimiento" note="Video de presentación" />
            <div className="project-video-heading">
              <h2 id="video-title" className="story-heading">
                Así toma forma
                <br />
                <em>un nuevo encuentro.</em>
              </h2>
              <p>Descubre el Centro de Convenciones ULEAM en este recorrido audiovisual.</p>
            </div>
            <video className="project-film" controls preload="metadata" playsInline poster={galleryImage1}>
              <source src={projectFilm} type="video/mp4" />
              Tu navegador no puede reproducir este video.
            </video>
          </div>
        </section>
        <section
          id="recorrido-virtual"
          className="landing-shell section-space tour-invite-section"
          aria-labelledby="tour-title"
        >
          <Chapter
            number="05"
            label="Entra en tu próxima idea"
            note="Recorrido virtual · 360°"
          />
          <div className="virtual-invite">
            <div className="virtual-invite-copy">
              <h2 id="tour-title" className="story-heading">
                Antes de vivirlo,
                <br />
                <em>recórrelo.</em>
              </h2>
              <p>
                Abre la puerta, mira a tu alrededor y encuentra tu lugar.
                Explora la recepción, el auditorio, la exposición y la sala de
                encuentros en nuestro modelo conceptual.
              </p>
              <a
                href={tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="virtual-invite-cta"
              >
                Entrar al recorrido 360° <Arrow />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <small>
                MODELO CONCEPTUAL · NO REPRESENTA LAS INSTALACIONES REALES
              </small>
              <div className="tour-stop-list" aria-label="Espacios del modelo">
                <span>01 / Recepción</span>
                <span>02 / Auditorio</span>
                <span>03 / Exposición</span>
                <span>04 / Encuentros</span>
              </div>
            </div>
            <Suspense
              fallback={
                <a
                  href={tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="virtual-invite-art"
                >
                  Explora el centro en 360°
                </a>
              }
            >
              <VirtualCardPreview />
            </Suspense>
          </div>
        </section>
        <section
          id="servicios"
          className="services-section"
          aria-labelledby="services-title"
        >
          <div className="landing-shell section-space">
            <Chapter
              number="06"
              label="Lo hacemos posible, contigo"
              note="Del primer detalle al último"
            />
            <div className="section-intro">
              <div>
                <h2 id="services-title" className="story-heading">
                  Tú traes la idea.
                  <br />
                  <em>La pensamos contigo.</em>
                </h2>
              </div>
              <p className="section-description">
                Un buen encuentro se siente natural. Detrás, hay un equipo que
                escucha, planifica y cuida lo que necesitas.
              </p>
            </div>
            <div className="service-editorial-list">
              {services.map((service, index) => (
                <article className="service-editorial-row" key={service.title}>
                  <span className="service-index">0{index + 1}</span>
                  <h3>
                    {service.title}
                    <small>{service.tag}</small>
                  </h3>
                  <p>{service.text}</p>
                  <span className="service-plus" aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
            <a href="#cotizar" className="editorial-link service-link">
              Cuéntanos qué necesitas <Arrow />
            </a>
          </div>
        </section>
        <section
          id="eventos"
          className="landing-shell section-space events-section"
          aria-labelledby="events-title"
        >
          <Chapter
            number="07"
            label="Cuando la idea se hace encuentro"
            note="Momentos compartidos"
          />
          <div className="section-intro">
            <div>
              <h2 id="events-title" className="story-heading">
                El espacio cobra vida
                <br />
                <em>con las personas.</em>
              </h2>
            </div>
            <p className="section-description">
              Un archivo de congresos, celebraciones y experiencias de nuestra
              comunidad. Abre cada evento para recorrer su galería.
            </p>
          </div>
          <div className="event-archive-grid">
            {archivedEvents.map((event) => (
              <article className="event-feature" key={event.id}>
                <button
                  type="button"
                  className="event-image event-image-trigger"
                  onClick={() => {
                    setActiveEvent(event)
                    setActiveEventPhoto(0)
                  }}
                  aria-label={`Ver galería de ${event.title}`}
                  aria-haspopup="dialog"
                >
                  <img src={event.cover} alt={event.coverAlt} loading="lazy" />
                  <span className="event-tag">Archivo de eventos</span>
                  <span className="event-image-count">{event.gallery.length} FOTOS <Arrow /></span>
                </button>
                <div className="event-copy">
                  <p className="eyebrow">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-meta">
                    <span><small>FECHA</small>{event.date}</span>
                    <span><small>LUGAR</small>{event.location}</span>
                  </div>
                  <button
                    type="button"
                    className="event-status event-gallery-link"
                    onClick={() => {
                      setActiveEvent(event)
                      setActiveEventPhoto(0)
                    }}
                    aria-haspopup="dialog"
                  >
                    Abrir álbum · {event.gallery.length} imágenes <Arrow />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {activeEvent && (
          <div className="event-modal-backdrop" onClick={() => setActiveEvent(null)}>
            <section
              className="event-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <header className="event-modal-header">
                <div>
                  <p className="eyebrow">{activeEvent.category}</p>
                  <h2 id="event-modal-title">{activeEvent.title}</h2>
                  <p>{activeEvent.date} <span>·</span> {activeEvent.location}</p>
                </div>
                <button
                  type="button"
                  className="event-modal-close"
                  onClick={() => setActiveEvent(null)}
                  aria-label="Cerrar galería"
                >
                  ×
                </button>
              </header>
              <div className="event-gallery-viewer">
                <img
                  src={activeEvent.gallery[activeEventPhoto].src}
                  alt={activeEvent.gallery[activeEventPhoto].alt}
                />
                <div className="event-gallery-caption">
                  <span>{activeEvent.gallery[activeEventPhoto].caption}</span>
                  <small>0{activeEventPhoto + 1} / 0{activeEvent.gallery.length}</small>
                </div>
              </div>
              <div className="event-gallery-thumbnails" aria-label="Fotos del evento">
                {activeEvent.gallery.map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    className={index === activeEventPhoto ? "is-active" : ""}
                    onClick={() => setActiveEventPhoto(index)}
                    aria-label={`Ver foto ${index + 1}: ${photo.caption}`}
                    aria-pressed={index === activeEventPhoto}
                  >
                    <img src={photo.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
        <section
          id="resenas"
          className="reviews-section"
          aria-labelledby="reviews-title"
        >
          <div className="landing-shell reviews-layout">
            <div className="reviews-copy">
              <Chapter number="08" label="Lo que se queda" />
              <h2 id="reviews-title" className="story-heading">
                Las historias
                <br />
                que vienen
                <br />
                <em>después.</em>
              </h2>
              <p>
                Un evento termina. Las conexiones, las conversaciones y los
                recuerdos siguen.
              </p>
              <p className="reviews-note">
                Aquí encontrarán su lugar las primeras reseñas verificadas de
                quienes organizan y viven nuestros encuentros. Historias reales,
                contadas por sus protagonistas.
              </p>
              <a href="#cotizar" className="editorial-link">
                La próxima historia puede ser la tuya <Arrow />
              </a>
            </div>
            <ReviewMarquee />
          </div>
        </section>
        <section
          id="cotizar"
          className="quote-section"
          aria-labelledby="quote-title"
        >
          <div className="landing-shell section-space">
            <div className="quote-heading">
              <p className="eyebrow">
                El siguiente capítulo lo escribimos juntos
              </p>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="quote-layout">
              <h2 id="quote-title" className="story-heading">
                Todo empezó
                <br />
                con <em>una idea.</em>
                <br />
                Ahora, cuéntanos la tuya.
              </h2>
              <div className="quote-copy">
                <p>
                  Un formato, una fecha, una primera intuición. Cuéntanos qué
                  imaginas y demos juntos el primer paso para hacerlo posible.
                </p>
                <a
                  href="mailto:convenciones@uleam.edu.ec"
                  className="button-light"
                >
                  Hablemos de tu evento <Arrow />
                </a>
                <a
                  href="mailto:convenciones@uleam.edu.ec"
                  className="quote-email"
                >
                  convenciones@uleam.edu.ec
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contacto" className="landing-footer">
        <div className="landing-shell">
          <div className="footer-main">
            <div>
              <Brand />
              <p>
                Un lugar para encontrarnos.
                <br />
                Un punto de partida para lo que viene.
              </p>
            </div>
            <div>
              <p className="footer-title">Encuéntranos</p>
              <a href="tel:+59352623028">+593 5 262 3028</a>
              <a href="mailto:convenciones@uleam.edu.ec">
                convenciones@uleam.edu.ec
              </a>
              <p>
                Av. Circunvalación, vía San Mateo
                <br />
                Manta, Manabí · Ecuador
              </p>
            </div>
            <div>
              <p className="footer-title">Sigue la historia</p>
              <div className="footer-nav">
                {navigation.map((item) => (
                  <a href={item.href} key={item.href}>
                    {item.label}
                  </a>
                ))}
                <a href="#eventos">Eventos</a>
                <a href="#cotizar">Crear mi evento</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Centro de Convenciones ULEAM
            </span>
            <span>Universidad Laica Eloy Alfaro de Manabí</span>
            <a href="#inicio">
              Volver al inicio <Arrow />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
