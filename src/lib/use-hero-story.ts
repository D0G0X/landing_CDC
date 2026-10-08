import { useEffect, type RefObject } from "react"

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start))
  return t * t * (3 - 2 * t)
}

/** Scroll drives the scene; damping only runs while its position is changing. */
export function useHeroStory(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = ref.current
    const stage = hero?.querySelector<HTMLElement>(".hero-stage")
    const copy = hero?.querySelector<HTMLElement>(".hero-copy")
    if (!hero || !stage || !copy) return
    const actions = copy.querySelectorAll<HTMLAnchorElement>("a")
    const scrollHint = hero.querySelector<HTMLAnchorElement>(".hero-scroll")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0,
      previousTime = 0,
      progress = 0,
      target = 0,
      start = 0,
      travel = 1
    let compact = false
    const paint = () => {
      // Keep the first two scenes at their original scroll pace, then leave
      // a dedicated closing stretch for the camera move and gentle dimming.
      const storyPortion = compact ? 0.5 : 0.58
      const storyProgress = clamp(progress / storyPortion)
      const exitStart = storyPortion + 0.1
      const exit = smoothstep(exitStart, 1, progress)
      const textExit = smoothstep(exitStart, exitStart + 0.18, progress)
      const departure = smoothstep(0.1, 0.43, storyProgress)
      const arrival = smoothstep(0.38, 0.7, storyProgress)
      hero.style.setProperty(
        "--hero-scale",
        String(1.035 + storyProgress * (compact ? 0.08 : 0.14) + exit * (compact ? 0.5 : 0.7)),
      )
      hero.style.setProperty(
        "--hero-image-y",
        `${storyProgress * (compact ? -10 : -24) - exit * (compact ? 12 : 28)}px`,
      )
      hero.style.setProperty("--hero-copy-opacity", String(1 - departure))
      hero.style.setProperty("--hero-copy-y", `${departure * -48}px`)
      hero.style.setProperty("--hero-story-opacity", String(arrival * (1 - textExit)))
      hero.style.setProperty("--hero-story-y", `${(1 - arrival) * 32 - textExit * 18}px`)
      hero.style.setProperty("--hero-shade", String(0.12 + arrival * 0.27 + exit * 0.33))
      hero.style.setProperty("--hero-bottom-opacity", String(1 - textExit))
      hero.style.setProperty("--hero-progress", String(progress))
      hero.dataset.scene = storyProgress > 0.52 ? "encuentro" : "idea"
      // Faded calls to action must not become invisible keyboard stops.
      actions.forEach((link) => {
        link.inert = departure > 0.97
      })
      copy.style.pointerEvents = departure > 0.97 ? "none" : ""
      if (scrollHint) scrollHint.inert = textExit > 0.97
    }
    const animate = (time: number) => {
      frame = 0
      const dt = previousTime ? Math.min(time - previousTime, 64) : 16
      previousTime = time
      progress += (target - progress) * (1 - Math.exp(-dt / 75))
      if (Math.abs(target - progress) < 0.0005) progress = target
      paint()
      if (progress !== target) frame = requestAnimationFrame(animate)
      else previousTime = 0
    }
    const onScroll = () => {
      if (motion.matches) return
      target = clamp((window.scrollY - start) / travel)
      if (!frame && target !== progress) frame = requestAnimationFrame(animate)
    }
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      start = window.scrollY + hero.getBoundingClientRect().top
      travel = Math.max(1, hero.offsetHeight - stage.offsetHeight)
      compact = window.innerWidth < 640
      progress = target = motion.matches
        ? 0
        : clamp((window.scrollY - start) / travel)
      paint()
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    window.addEventListener("pageshow", measure)
    motion.addEventListener("change", measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      window.removeEventListener("pageshow", measure)
      motion.removeEventListener("change", measure)
      actions.forEach((link) => {
        link.inert = false
      })
      copy.style.pointerEvents = ""
      if (scrollHint) scrollHint.inert = false
    }
  }, [ref])
}
