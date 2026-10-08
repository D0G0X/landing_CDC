import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { UleamGlobe } from "./components/uleam-globe"
import { ReviewMarquee } from "./components/review-marquee"
import { tourUrl } from "./lib/navigation"
import { useHeroStory } from "./lib/use-hero-story"
import heroImage from "./assets/uleam-convention-center-hero.jpeg"

const VirtualCardPreview = lazy(() =>
  import("./components/virtual-card-preview").then((module) => ({
    default: module.VirtualCardPreview,
  })),
)
const images = {
  hero: heroImage,
  hall: "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
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
    image: images.service,
    alt: "Salón dispuesto para una celebración",
  },
  {
    kicker: "Eventos corporativos",
    title: "Conexiones que crecen.",
    text: "Reúne a tu equipo, presenta lo que viene o inicia una nueva alianza. Cada formato encuentra aquí una posibilidad.",
    image: images.experience,
    alt: "Espacio preparado para un encuentro",
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
      <span className="brand-mark">
        CC
        <span />
      </span>
      <span className="brand-copy">
        <strong>CCU</strong>
        <small>Centro de Convenciones ULEAM</small>
      </span>
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
              alt="Render arquitectónico exterior del Centro de Convenciones ULEAM"
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
          id="recorrido-virtual"
          className="landing-shell section-space tour-invite-section"
          aria-labelledby="tour-title"
        >
          <Chapter
            number="03"
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
              number="04"
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
            number="05"
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
              Lo que se prepara con intención se convierte en un momento para
              recordar. Una mirada a los encuentros que nos reúnen.
            </p>
          </div>
          <article className="event-feature">
            <div className="event-image">
              <img
                src={images.event}
                alt="Montaje elegante de un salón para un evento"
                loading="lazy"
              />
              <span className="event-tag">Archivo de eventos</span>
            </div>
            <div className="event-copy">
              <p className="eyebrow">Encuentro institucional</p>
              <h3>Noche de Excelencia Académica</h3>
              <p>
                Reconocer el talento también es una forma de encontrarnos. Una
                ceremonia dedicada a la dedicación y los logros de nuestra
                comunidad universitaria.
              </p>
              <div className="event-meta">
                <span>28 junio 2025</span>
                <span>18:30</span>
              </div>
              <span className="event-status">Un momento compartido</span>
            </div>
          </article>
        </section>
        <section
          id="resenas"
          className="reviews-section"
          aria-labelledby="reviews-title"
        >
          <div className="landing-shell reviews-layout">
            <div className="reviews-copy">
              <Chapter number="06" label="Lo que se queda" />
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
