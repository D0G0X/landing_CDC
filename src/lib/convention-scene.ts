import * as THREE from "three"

export const stops = [
  {
    name: "Recepción",
    subtitle: "El comienzo de cada encuentro",
    description:
      "Un vestíbulo de doble altura, luz natural y un punto de bienvenida que conecta todos los espacios.",
    x: 0,
    z: 6,
    yaw: 0,
    tag: "BIENVENIDA",
  },
  {
    name: "Auditorio",
    subtitle: "Un escenario para las ideas",
    description:
      "Un auditorio íntimo con escenario central, paneles acústicos y asientos dispuestos para compartir nuevas perspectivas.",
    x: 0,
    z: -7,
    yaw: 0,
    tag: "CONFERENCIAS",
  },
  {
    name: "Exposición",
    subtitle: "Espacio para descubrir",
    description:
      "Una pequeña galería con módulos de exhibición y circulación abierta para conectar proyectos y personas.",
    x: -13,
    z: 5,
    yaw: 0,
    tag: "EXHIBICIONES",
  },
  {
    name: "Sala de encuentros",
    subtitle: "Las conversaciones continúan",
    description:
      "Un ambiente cálido con mesas de reunión, vegetación y rincones para conversar entre eventos.",
    x: 13,
    z: 6,
    yaw: -0.55,
    tag: "CONEXIONES",
  },
]

/** A small, entirely procedural venue: no remote models or textures. */
export function createConventionScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color("#c7d9dd")
  scene.fog = new THREE.Fog("#c7d9dd", 45, 100)
  const materials: THREE.Material[] = []
  const textures: THREE.Texture[] = []
  const material = (color: string, roughness = 0.75) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness })
    materials.push(m)
    return m
  }
  const stone = material("#ded8c9"),
    white = material("#f2eee4"),
    wood = material("#98765a"),
    dark = material("#283a39"),
    brass = material("#b9a06e", 0.4),
    green = material("#536c50"),
    soil = material("#403d32")
  const glow = new THREE.MeshBasicMaterial({ color: "#fff4d5" })
  materials.push(glow)
  const box = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
    mesh.position.set(x, y, z)
    mesh.receiveShadow = true
    mesh.castShadow = true
    scene.add(mesh)
    return mesh
  }
  const cylinder = (
    x: number,
    y: number,
    z: number,
    radius: number,
    h: number,
    m: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 0.85, h, 20),
      m,
    )
    mesh.position.set(x, y, z)
    scene.add(mesh)
    return mesh
  }
  const label = (
    text: string,
    x: number,
    y: number,
    z: number,
    width: number,
    bg = "#283a39",
  ) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1024, 256)
    ctx.fillStyle = "#f5eee0"
    ctx.font = "500 66px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, 512, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.push(texture)
    const m = new THREE.MeshBasicMaterial({ map: texture })
    materials.push(m)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), m)
    mesh.position.set(x, y, z)
    scene.add(mesh)
  }
  const plant = (x: number, z: number) => {
    cylinder(x, 0.35, z, 0.4, 0.7, stone)
    cylinder(x, 0.72, z, 0.33, 0.04, soil)
    cylinder(x, 1.2, z, 0.055, 1.3, wood)
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.48, 10, 8), green)
      leaf.scale.set(0.75, 1.8, 0.5)
      leaf.position.set(
        x + Math.sin(i * 2.4) * 0.25,
        1.6 + (i % 2) * 0.35,
        z + Math.cos(i * 2.4) * 0.25,
      )
      leaf.rotation.z = Math.sin(i) * 0.6
      scene.add(leaf)
    }
  }
  scene.add(new THREE.HemisphereLight("#fff8e8", "#969b92", 2.5))
  const sun = new THREE.DirectionalLight("#ffefd5", 3)
  sun.position.set(-15, 25, 20)
  scene.add(sun)
  box(0, -0.2, 0, 100, 0.2, 100, material("#a6b39a"))
  // Four rooms, with door-sized openings in the connecting partitions.
  for (const [cx, cz, w, d] of [
    [0, 5, 12, 12],
    [0, -8, 12, 14],
    [-13, 5, 14, 12],
    [13, 5, 14, 12],
  ]) {
    box(cx, -0.08, cz, w, 0.16, d, stone)
    box(cx, 4.5, cz, w, 0.2, d, white)
    box(cx, 2.25, cz - d / 2, w, 4.5, 0.18, white)
    for (let x = cx - w / 2 + 1; x < cx + w / 2; x += 2) {
      box(x, 4.32, cz, 0.12, 0.2, d, wood)
      box(x + 0.22, 4.35, cz, 0.05, 0.03, d - 1, glow)
    }
    // Open glazed facade: thin mullions preserve the view to the garden.
    for (let x = cx - w / 2; x <= cx + w / 2; x += 2)
      box(x, 2.2, cz + d / 2, 0.09, 4.4, 0.12, dark)
    box(cx, 0.28, cz + d / 2, w, 0.56, 0.18, stone)
    for (let x = cx - w / 2; x < cx + w / 2; x += 1.5)
      box(x, 0.008, cz, 0.018, 0.01, d, white)
  }
  // Replace the lobby's back partition with an open portal to the auditorium.
  const lobbyBack = scene.children.find(
    (o) =>
      o instanceof THREE.Mesh &&
      o.position.x === 0 &&
      o.position.y === 2.25 &&
      o.position.z === -1,
  )
  if (lobbyBack instanceof THREE.Mesh) {
    scene.remove(lobbyBack)
    lobbyBack.geometry.dispose()
  }
  box(-4.2, 2.25, -1, 3.6, 4.5, 0.2, white)
  box(4.2, 2.25, -1, 3.6, 4.5, 0.2, white)
  box(0, 3.7, -1, 4.8, 1.6, 0.2, white)
  for (const x of [-6, 6]) {
    box(x, 2.25, 1, 0.18, 4.5, 4, white)
    box(x, 2.25, 9, 0.18, 4.5, 4, white)
    box(x, 3.8, 5, 0.18, 1.4, 4, white)
  }
  box(-20, 2.25, 5, 0.2, 4.5, 12, white)
  box(20, 2.25, 5, 0.2, 4.5, 12, white)
  box(-6, 2.25, -8, 0.2, 4.5, 14, wood)
  box(6, 2.25, -8, 0.2, 4.5, 14, wood)
  // Reception.
  box(3.7, 0.55, 1.1, 3.1, 1.1, 1.05, wood)
  box(3.7, 1.13, 1.1, 3.3, 0.12, 1.2, white)
  label("U.  /  BIENVENIDOS", 4, 2.4, -0.87, 3.3)
  label("AUDITORIO  ↑", 0, 3.5, -0.85, 3)
  box(-3.4, 0.36, 4, 2.6, 0.65, 1, dark)
  box(-3.4, 0.8, 4.4, 2.6, 0.65, 0.2, dark)
  plant(-4.8, 0.2)
  plant(5, 8.8)
  // Auditorium, central aisle and low stage.
  box(0, 0.25, -13, 10, 0.5, 3, wood)
  box(0, 2.4, -14.82, 7, 3, 0.08, dark)
  label("Las ideas nos reúnen.", 0, 2.7, -14.75, 6)
  label("U L E A M  /  CONVENCIONES", 0, 1.7, -14.74, 4)
  for (let row = 0; row < 4; row++)
    for (const x of [-4.2, -3, -1.8, 1.8, 3, 4.2]) {
      const z = -10.6 + row * 1.7
      box(x, 0.47, z, 0.85, 0.18, 0.8, dark)
      box(x, 0.92, z + 0.35, 0.85, 0.9, 0.16, dark)
      for (const dx of [-0.3, 0.3]) box(x + dx, 0.22, z, 0.06, 0.45, 0.6, brass)
    }
  for (const x of [-5.82, 5.82])
    for (let z = -14; z < -1; z += 0.5) box(x, 2.3, z, 0.12, 3.8, 0.09, dark)
  // Exhibition pedestals and framed abstract artworks.
  label("NUEVAS PERSPECTIVAS", -13, 3.2, -0.85, 6)
  for (let i = 0; i < 3; i++) {
    const x = -17 + i * 4
    box(x, 0.55, 1.5, 1.2, 1.1, 1.2, white)
    const art = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.42, 0.13, 64, 10),
      i % 2 ? brass : dark,
    )
    art.position.set(x, 1.65, 1.5)
    scene.add(art)
    box(x, 2.05, -0.82, 2.1, 2, 0.08, wood)
    box(x, 2.05, -0.75, 1.85, 1.75, 0.05, i % 2 ? dark : brass)
  }
  plant(-18.5, 8)
  plant(-7.5, 1)
  // Lounge: small round tables and upholstered stools.
  label("CONECTAR / COMPARTIR", 13, 3.2, -0.85, 6)
  for (const [x, z] of [
    [10, 2],
    [16, 2],
    [16, 7],
  ]) {
    cylinder(x, 0.78, z, 0.95, 0.12, wood)
    cylinder(x, 0.38, z, 0.09, 0.75, brass)
    for (const dx of [-1.3, 1.3]) {
      cylinder(x + dx, 0.4, z, 0.4, 0.65, dark)
    }
    cylinder(x, 0.95, z, 0.15, 0.25, white)
  }
  plant(18.5, 9)
  plant(7.5, 1)
  // Garden silhouettes and paving beyond the glazing.
  box(0, -0.01, 13, 42, 0.1, 4, white)
  for (let x = -24; x <= 24; x += 6) {
    plant(x, 17)
    cylinder(x, 2, 22, 0.2, 4, wood)
    const crown = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 8), green)
    crown.position.set(x, 4.8, 22)
    scene.add(crown)
  }
  return {
    scene,
    dispose: () => {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose()
      })
      materials.forEach((m) => m.dispose())
      textures.forEach((t) => t.dispose())
    },
  }
}
