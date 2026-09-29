import { useEffect, useRef, useState } from "react";

const images = {
  hero: "https://images.unsplash.com/photo-1771911650735-b471e85e8b17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=86&w=2000",
  hall: "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
  service:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
  experience:
    "https://images.unsplash.com/photo-1651313948618-31644c7fec18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1600",
  event:
    "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=84&w=1400",
};

const slides = [
  {
    kicker: "Arquitectura que inspira",
    title: "Espacios",
    text: "Salones versátiles con la escala y el equipamiento para transformar cada idea.",
    image: images.hall,
  },
  {
    kicker: "Todo en un solo lugar",
    title: "Servicios",
    text: "Soluciones integrales para que la producción de tu evento fluya sin imprevistos.",
    image: images.service,
  },
  {
    kicker: "Cuidamos cada detalle",
    title: "Experiencia",
    text: "Acompañamiento cercano antes, durante y después de cada encuentro.",
    image: images.experience,
  },
];

const Arrow = ({ down = false }: { down?: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`size-5 fill-none stroke-current stroke-[1.7] ${down ? "rotate-90" : ""}`}
  >
    <path d="M5 12h14M14 6l6 6-6 6" />
  </svg>
);

const Mark = ({ compact = false }: { compact?: boolean }) => (
  <a href="#inicio" className="flex items-center gap-3" aria-label="CCU, ir al inicio">
    <span
      className={`relative grid place-items-center border border-white/35 font-display font-bold tracking-[-.08em] text-white ${
        compact ? "size-9 text-xs" : "size-11 text-sm"
      }`}
    >
      CC
      <span className="absolute -bottom-px right-0 h-1 w-4 bg-[#df1f26]" />
    </span>
    <span className={compact ? "hidden sm:block" : "block"}>
      <span className="block text-[11px] font-semibold leading-none tracking-[.22em] text-white">CCU</span>
      <span className="mt-1 block text-[8px] font-medium uppercase tracking-[.12em] text-white/55">
        Universidad Laica Eloy Alfaro
      </span>
    </span>
  </a>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      5500,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateHero = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / (hero.offsetHeight - window.innerHeight)));
      const fadeProgress = Math.max(0, (progress - 0.78) / 0.22);
      hero.style.setProperty("--hero-scale", String(1 + progress * 0.85));
      hero.style.setProperty("--hero-opacity", String(1 - fadeProgress * 0.92));
      hero.style.setProperty("--hero-blur", `${fadeProgress * 4}px`);
      hero.style.setProperty("--hero-content-opacity", String(1 - progress * 1.65));
      hero.style.setProperty("--hero-content-y", `${progress * -42}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHero);
    };

    updateHero();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const goToSlide = (next: number) => {
    setActiveSlide((next + slides.length) % slides.length);
  };

  return (
    <main className="overflow-hidden bg-[#f4f2ee] text-[#171717]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <Mark compact />
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[.12em] text-white/70 lg:flex">
            {["Inicio", "Nosotros", "Espacios", "Servicios", "Eventos", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <a
              href="#cotizar"
              className="bg-[#df1f26] px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-white transition-colors hover:bg-[#f1262e] sm:px-5"
            >
              Cotizar
            </a>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid size-10 place-content-center gap-1.5 border border-white/20 lg:hidden"
            >
              <span className="block h-px w-4 bg-white" />
              <span className="block h-px w-4 bg-white" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-[#0a0a0a] px-5 py-6 lg:hidden">
            {["Inicio", "Nosotros", "Espacios", "Servicios", "Eventos", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/10 py-3 text-sm font-medium text-white/80"
              >
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section ref={heroRef} id="inicio" className="relative h-[145svh] bg-black">
        <div className="sticky top-0 flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-black">
          <img
            src={images.hero}
            alt="Interior contemporáneo de un centro de convenciones"
            className="hero-image absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.36)_64%,rgba(0,0,0,.18)_100%)]" />
          <div className="hero-overlay absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.9)_0%,transparent_45%,rgba(0,0,0,.25)_100%)]" />
          <div className="hero-content relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-28 lg:px-14 lg:pb-24">
          <div className="max-w-[760px]">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.26em] text-white/65">
              <span className="h-px w-8 bg-[#df1f26]" />
              Manta · Ecuador
            </p>
            <h1 className="font-display text-[clamp(3.25rem,8vw,7.5rem)] font-semibold leading-[.83] tracking-[-.065em] text-white">
              El escenario
              <br />
              <span className="text-outline">de tus ideas.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
              Un lugar diseñado para encuentros, eventos y experiencias que dejan huella.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#cotizar" className="button-primary group">
                Cotizar mi evento
                <Arrow />
              </a>
              <a href="#espacios" className="button-ghost">
                Explorar espacios
              </a>
            </div>
          </div>
          <a
            href="#nosotros"
            className="absolute bottom-6 right-5 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[.16em] text-white/55 sm:flex lg:right-14"
          >
            Descubre el CCU
            <span className="grid size-9 place-items-center rounded-full border border-white/25">
              <Arrow down />
            </span>
          </a>
          </div>
        </div>
      </section>

      <section id="nosotros" className="bg-[#f4f2ee] px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[1332px]">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="section-kicker">Centro de Convenciones ULEAM</p>
              <div className="mt-8 hidden h-px w-24 bg-black/20 lg:block" />
            </div>
            <div>
              <h2 className="font-display max-w-4xl text-[clamp(2.4rem,5vw,5.15rem)] font-medium leading-[.98] tracking-[-.055em]">
                Más que un espacio.
                <span className="block text-black/35">Una experiencia que conecta.</span>
              </h2>
              <div className="mt-10 grid gap-7 border-t border-black/15 pt-8 sm:grid-cols-2">
                <p className="max-w-md text-base leading-7 text-black/62">
                  Creamos el entorno perfecto para conferencias, ceremonias, encuentros corporativos y
                  momentos memorables.
                </p>
                <p className="max-w-md text-base leading-7 text-black/62">
                  Infraestructura contemporánea, atención cercana y el respaldo de la Universidad Laica
                  Eloy Alfaro de Manabí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="espacios" className="relative bg-[#0b0b0c] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex items-end justify-between px-5 sm:px-8 lg:px-14">
            <div>
              <p className="section-kicker text-white/45">Conoce nuestros espacios</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.045em] sm:text-6xl">
                Diseñados para sorprender.
              </h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button className="slider-control rotate-180" onClick={() => goToSlide(activeSlide - 1)} aria-label="Anterior">
                <Arrow />
              </button>
              <button className="slider-control" onClick={() => goToSlide(activeSlide + 1)} aria-label="Siguiente">
                <Arrow />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.72fr)_minmax(360px,.72fr)]">
            <div className="relative min-h-[480px] overflow-hidden sm:min-h-[650px] lg:min-h-[690px]">
              {slides.map((slide, index) => (
                <img
                  key={slide.title}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                    index === activeSlide ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />
              <span className="absolute bottom-5 left-5 font-display text-6xl font-medium text-white/25 sm:bottom-9 sm:left-10">
                0{activeSlide + 1}
              </span>
            </div>
            <div id="servicios" className="flex min-h-[410px] flex-col justify-between bg-[#171719] p-7 sm:p-10 lg:p-12">
              <div className="flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    aria-label={`Ver ${slide.title}`}
                    onClick={() => setActiveSlide(index)}
                    className="h-1 flex-1 bg-white/15"
                  >
                    <span
                      className={`block h-full bg-[#df1f26] transition-[width] duration-500 ${
                        index === activeSlide ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="py-9">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#df1f26]">
                  {slides[activeSlide].kicker}
                </p>
                <h3 className="mt-4 font-display text-5xl font-medium tracking-[-.05em]">
                  {slides[activeSlide].title}
                </h3>
                <p className="mt-5 max-w-sm text-base leading-7 text-white/55">
                  {slides[activeSlide].text}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/12 pt-6">
                <a href="#cotizar" className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.15em]">
                  Conocer más <Arrow />
                </a>
                <div className="flex gap-2 sm:hidden">
                  <button className="slider-control rotate-180" onClick={() => goToSlide(activeSlide - 1)} aria-label="Anterior">
                    <Arrow />
                  </button>
                  <button className="slider-control" onClick={() => goToSlide(activeSlide + 1)} aria-label="Siguiente">
                    <Arrow />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1332px]">
          <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker">Por qué elegirnos</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.045em] sm:text-6xl">
                Todo para hacerlo posible.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-black/50">
              Cada evento es único. Nuestro compromiso es hacer que también sea extraordinario.
            </p>
          </div>
          <div className="grid border-x border-t border-black/12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Espacios versátiles", "Ambientes adaptables a distintos formatos de evento."],
              ["02", "Ubicación estratégica", "Dentro del campus ULEAM, en el corazón de Manta."],
              ["03", "Atención personalizada", "Un equipo presente en cada etapa del proceso."],
              ["04", "Producción profesional", "Acompañamiento para cuidar la producción de tu evento."],
            ].map(([number, title, text]) => (
              <article key={number} className="benefit-card">
                <span className="font-display text-sm text-[#df1f26]">{number}</span>
                <div className="mt-16">
                  <h3 className="font-display text-2xl font-medium tracking-[-.035em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/50">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="eventos" className="bg-[#e8e5df] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1332px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="section-kicker">Agenda CCU</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.045em] sm:text-6xl">
                Evento pasado
              </h2>
            </div>
            <a href="#contacto" className="hidden items-center gap-3 text-xs font-bold uppercase tracking-[.14em] sm:flex">
              Ver agenda <Arrow />
            </a>
          </div>
          <article className="group grid overflow-hidden bg-[#111] text-white lg:grid-cols-[1.25fr_.75fr]">
            <div className="relative min-h-[390px] overflow-hidden sm:min-h-[530px]">
              <img
                src={images.event}
                alt="Montaje elegante para un evento"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute left-5 top-5 bg-[#df1f26] px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] sm:left-8 sm:top-8">
                Archivo
              </span>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">
                  Encuentro institucional
                </p>
                <h3 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-.045em] sm:text-5xl">
                  Noche de Excelencia Académica
                </h3>
                <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
                  Una ceremonia para reconocer el talento, la dedicación y los logros de nuestra comunidad
                  universitaria.
                </p>
              </div>
              <div className="mt-14">
                <div className="grid grid-cols-2 gap-6 border-y border-white/15 py-6 text-sm">
                  <div>
                  <span className="block text-[9px] uppercase tracking-[.18em] text-white/40">Fecha</span>
                  <span className="mt-2 block">28 Junio 2025</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[.18em] text-white/40">Hora</span>
                    <span className="mt-2 block">18:30</span>
                  </div>
                </div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[.16em] text-white/45">
                  Evento realizado
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="cotizar" className="relative bg-[#df1f26] px-5 py-24 text-white sm:px-8 lg:px-14 lg:py-32">
        <div className="quote-lines absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-[1332px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-white/65">Hagámoslo realidad</p>
            <h2 className="mt-6 font-display text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[.88] tracking-[-.06em]">
              ¿Tienes un
              <br />
              evento en mente?
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-md text-lg leading-7 text-white/75">
              Cuéntanos qué necesitas y recibe una propuesta pensada para tu evento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:convenciones@uleam.edu.ec" className="button-light">
                Solicitar cotización <Arrow />
              </a>
              <a href="#contacto" className="button-ghost">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="bg-[#090909] px-5 pb-8 pt-20 text-white sm:px-8 lg:px-14 lg:pt-24">
        <div className="mx-auto max-w-[1332px]">
          <div className="grid gap-14 border-b border-white/12 pb-16 md:grid-cols-2 lg:grid-cols-[1.15fr_.7fr_.7fr]">
            <div>
              <Mark />
              <p className="mt-8 max-w-sm text-sm leading-6 text-white/42">
                El espacio donde las ideas encuentran escenario y los encuentros se convierten en
                experiencias.
              </p>
            </div>
            <div>
              <p className="footer-title">Contacto</p>
              <div className="mt-6 space-y-3 text-sm text-white/58">
                <a className="block hover:text-white" href="tel:+59352623028">
                  +593 5 262 3028
                </a>
                <a className="block hover:text-white" href="mailto:convenciones@uleam.edu.ec">
                  convenciones@uleam.edu.ec
                </a>
                <p>Av. Circunvalación Vía San Mateo<br />Manta, Manabí</p>
              </div>
            </div>
            <div>
              <p className="footer-title">Explora</p>
              <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-3 text-sm text-white/58">
                <a href="#nosotros">Nosotros</a>
                <a href="#espacios">Espacios</a>
                <a href="#servicios">Servicios</a>
                <a href="#eventos">Eventos</a>
                <a href="#cotizar">Cotizar</a>
                <a href="#contacto">Contacto</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-[9px] uppercase tracking-[.16em] text-white/28 sm:flex-row sm:justify-between">
            <p>© 2025 Centro de Convenciones ULEAM</p>
            <p>Universidad Laica Eloy Alfaro de Manabí</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
