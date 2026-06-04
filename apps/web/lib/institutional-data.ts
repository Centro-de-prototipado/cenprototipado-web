export type TeamMember = {
  name: string
  role: string
  portrait: string
}

export type TechnologySpotlight = {
  title: string
  subtitle: string
  description: string
  applications: string[]
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function createPortraitDataUri(name: string, accent: string, accent2: string) {
  const initials = initialsFromName(name)
  const svg = `
    <svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${accent2}" />
        </linearGradient>
        <radialGradient id="light" cx="35%" cy="24%" r="70%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.45)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" rx="60" fill="url(#bg)" />
      <circle cx="180" cy="140" r="260" fill="rgba(255,255,255,0.14)" />
      <circle cx="660" cy="860" r="260" fill="rgba(255,255,255,0.10)" />
      <rect x="70" y="70" width="660" height="860" rx="40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
      <path d="M80 730 C180 610, 300 560, 400 560 C500 560, 620 610, 720 730" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="18" stroke-linecap="round" />
      <g transform="translate(400 370)">
        <circle cx="0" cy="-110" r="120" fill="rgba(255,255,255,0.26)" />
        <path d="M-160 200 C-130 35, -75 -10, 0 -10 C75 -10, 130 35, 160 200" fill="rgba(255,255,255,0.24)" />
        <circle cx="-40" cy="-120" r="10" fill="rgba(255,255,255,0.7)" />
        <circle cx="40" cy="-120" r="10" fill="rgba(255,255,255,0.7)" />
        <path d="M-42 -78 C-18 -60, 18 -60, 42 -78" fill="none" stroke="rgba(255,255,255,0.72)" stroke-width="8" stroke-linecap="round" />
      </g>
      <text x="400" y="860" fill="white" font-size="140" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">${initials}</text>
      <rect x="70" y="70" width="660" height="860" rx="40" fill="url(#light)" />
    </svg>
  `

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const teamMembers: TeamMember[] = [
  {
    name: "Daniel Vick Gutierrez",
    role: "Coord. Centro de Prototipado",
    portrait: createPortraitDataUri(
      "Daniel Vick Gutierrez",
      "#3d2a1d",
      "#0f172a"
    ),
  },
  {
    name: "Luis Montes Monsalve",
    role: "Profesional y Coord. Aula STEM",
    portrait: createPortraitDataUri(
      "Luis Montes Monsalve",
      "#1f3b59",
      "#17324b"
    ),
  },
  {
    name: "Alejandra Ocampo",
    role: "Coord. Funcional Aula STEM",
    portrait: createPortraitDataUri("Alejandra Ocampo", "#43355f", "#0f1f3d"),
  },
  {
    name: "Jassy Perea",
    role: "Coord. Aulas STEM del Departamento",
    portrait: createPortraitDataUri("Jassy Perea", "#31504b", "#142a25"),
  },
  {
    name: "Sofia Rojas Montoya",
    role: "Coord. Aulas STEM Manizales",
    portrait: createPortraitDataUri(
      "Sofia Rojas Montoya",
      "#6a4b2f",
      "#20150f"
    ),
  },
  {
    name: "Carla Paola Tapasco Hernandez",
    role: "Tecnica de apoyo",
    portrait: createPortraitDataUri(
      "Carla Paola Tapasco Hernandez",
      "#5c4a27",
      "#1c1b14"
    ),
  },
  {
    name: "Cristian Andres Arenas Vargas",
    role: "Estudiante Auxiliar",
    portrait: createPortraitDataUri(
      "Cristian Andres Arenas Vargas",
      "#27465b",
      "#111b26"
    ),
  },
  {
    name: "Jerson Estiven Giraldo Florez",
    role: "Estudiante Auxiliar",
    portrait: createPortraitDataUri(
      "Jerson Estiven Giraldo Florez",
      "#3b2d52",
      "#160f24"
    ),
  },
  {
    name: "Jhon Edwin Garcia Cuervo",
    role: "Estudiante Auxiliar",
    portrait: createPortraitDataUri(
      "Jhon Edwin Garcia Cuervo",
      "#28504a",
      "#0d1e1d"
    ),
  },
  {
    name: "Luis Felipe Giraldo Ortega",
    role: "Estudiante Auxiliar",
    portrait: createPortraitDataUri(
      "Luis Felipe Giraldo Ortega",
      "#613741",
      "#231116"
    ),
  },
]

export const availableTechnologies = [
  "Impresoras 3D",
  "Microcontroladores",
  "Plotter",
  "Scanner 3D",
  "Sistema monoblock fischertechnik education",
  "Brazo robotico para soldadura",
  "Cortadora CNC",
  "Cortadora laser",
  "Gafas de realidad virtual",
  "Impresora 3D de resina",
]

export const technologySpotlights: TechnologySpotlight[] = [
  {
    title: "Brazo robotico para soldadura",
    subtitle: "Automatizacion y robotica aplicada",
    description:
      "Permite simular procesos de automatizacion industrial y aprender principios de robotica y control.",
    applications: [
      "Aprendizaje de robotica",
      "Simulacion de procesos industriales",
      "Programacion de movimientos automatizados",
      "Practicas educativas en automatizacion",
    ],
  },
  {
    title: "Cortadora CNC",
    subtitle: "Fabricacion con control computarizado",
    description:
      "Fabica piezas de alta precision a partir de disenos digitales mediante procesos de corte automatizados.",
    applications: [
      "Piezas estructurales",
      "Prototipos industriales",
      "Diseno y fabricacion de productos",
      "Maquetas y elementos tecnicos",
    ],
  },
  {
    title: "Cortadora laser",
    subtitle: "Corte y grabado de alta precision",
    description:
      "Permite cortar y grabar materiales como madera y acrilico con gran detalle.",
    applications: [
      "Maquetas arquitectonicas",
      "Piezas decorativas",
      "Senalizacion y diseno grafico",
      "Prototipos",
    ],
  },
  {
    title: "Gafas de realidad virtual",
    subtitle: "Experiencias tecnologicas inmersivas",
    description:
      "Facilitan la interaccion con entornos digitales para aprendizaje y experimentacion.",
    applications: [
      "Simulaciones educativas",
      "Exploracion de modelos 3D",
      "Experiencias interactivas",
      "Visualizacion de proyectos",
    ],
  },
  {
    title: "Impresora 3D en resina",
    subtitle: "Alta precision y detalle",
    description:
      "Ideal para piezas complejas y prototipos que requieren gran calidad de acabado.",
    applications: [
      "Piezas detalladas",
      "Modelos pequenos",
      "Prototipos de alta precision",
    ],
  },
  {
    title: "Impresora 3D",
    subtitle: "Fabricacion de objetos tridimensionales",
    description:
      "Convierte modelos digitales en prototipos fisicos para validar ideas y funcionalidades.",
    applications: [
      "Desarrollo de prototipos",
      "Piezas funcionales",
      "Modelos educativos",
      "Diseno de productos",
    ],
  },
  {
    title: "Microcontroladores",
    subtitle: "Programacion y desarrollo electronico",
    description:
      "Dispositivos programables para proyectos de robotica, automatizacion y electronica aplicada.",
    applications: [
      "Control de sensores y actuadores",
      "Automatizacion de sistemas",
      "Prototipos electronicos",
      "Proyectos de robotica",
    ],
  },
  {
    title: "Plotter y scanner 3D",
    subtitle: "Impresion y digitalizacion avanzada",
    description:
      "Herramientas para impresion de gran formato y captura digital de objetos reales.",
    applications: [
      "Impresion de planos y carteles",
      "Material grafico educativo",
      "Ingenieria inversa",
      "Conservacion y modificacion de modelos",
    ],
  },
]

export type TimelineEvent = {
  year: string
  title: string
  desc: string
  tag: string
}

export const timeline: TimelineEvent[] = [
  { year: "2022", title: "Génesis del programa", desc: "Identificación de necesidades del territorio en innovación pedagógica y fabricación digital.", tag: "Diagnóstico" },
  { year: "2023", title: "Primeras Aulas STEM", desc: "Articulación con docentes y colegios de Manizales para llevar metodologías STEM a aulas reales.", tag: "Red STEM" },
  { year: "2024", title: "Apertura de portafolio", desc: "Lanzamiento de los primeros casos: BIM+MR, AR Campus, simulaciones sísmicas y demos VR.", tag: "Casos de éxito" },
  { year: "2025", title: "Centro en Samoga", desc: "Instalación oficial del Centro de Prototipado en el segundo piso del Museo Interactivo Samoga.", tag: "Sede" },
  { year: "2025", title: "Resolución 1386", desc: "Reconocimiento institucional del proyecto y consolidación del equipo interdisciplinario.", tag: "Institucional" },
  { year: "2026", title: "Expansión territorial", desc: "Articulación con Caldas, alianzas con la industria local y nuevas tecnologías inmersivas.", tag: "Territorio" },
]

export type Ally = { label: string; sub: string }

export const allies: Ally[] = [
  { label: "UNAL Manizales", sub: "Sede" },
  { label: "DIMA", sub: "Investigación y Extensión" },
  { label: "Museo Samoga", sub: "Sede física" },
  { label: "Aulas STEM Manizales", sub: "Red educativa" },
  { label: "Aulas STEM Caldas", sub: "Red departamental" },
  { label: "Unimedios", sub: "Comunicaciones UNAL" },
  { label: "Fac. Arquitectura", sub: "BIM · AR" },
  { label: "Fac. Ingeniería", sub: "Simulación · Hardware" },
  { label: "Fac. Ciencias Salud", sub: "VR médica" },
  { label: "Industria local", sub: "Manizales · Caldas" },
]

export type FaqItem = { q: string; a: string }

export const faq: FaqItem[] = [
  { q: "¿Quién puede usar los equipos del Centro?",
    a: "Estudiantes, docentes e investigadores de la Universidad Nacional sede Manizales, así como aliados de la red STEM y proyectos avalados por DIMA. Comunidades externas pueden acceder a través de convenios o programas de extensión." },
  { q: "¿Cómo solicito el uso de un equipo o tecnología?",
    a: "Diligencia el formulario de reserva indicando el equipo, fecha y propósito. Recibirás confirmación en máximo 2 días hábiles. Para proyectos de mayor escala agenda una sesión de asesoría con el equipo del Centro." },
  { q: "¿Tiene costo el uso de las tecnologías?",
    a: "Para integrantes de la comunidad académica UNAL y proyectos de extensión social, el acceso es sin costo. Los materiales fungibles (filamento, resina, láminas) corren por cuenta del solicitante. Para empresas aliadas existen tarifas de servicio." },
  { q: "¿Ofrecen capacitaciones o talleres?",
    a: "Sí. Realizamos talleres regulares de impresión 3D, corte láser, electrónica, realidad virtual y BIM. Escríbenos para conocer los próximos eventos abiertos." },
  { q: "¿Puedo proponer un proyecto colaborativo?",
    a: "Por supuesto. Recibimos propuestas de docentes, semilleros, grupos de investigación y empresas. Escríbenos a cenprototipado_man@unal.edu.co con la descripción del proyecto y agendamos una reunión inicial." },
  { q: "¿Dónde queda el Centro?",
    a: "Estamos en el segundo piso del Museo Interactivo Samoga, en Manizales, Caldas. La entrada es por la portería principal del museo." },
]

export type Technology = {
  title: string
  subtitle: string
  description: string
  applications: string[]
  status: "disponible" | "reservada"
  units: number
  category: string
}

export const technologies: Technology[] = [
  { title: "Brazo robótico para soldadura", subtitle: "Automatización y robótica aplicada",
    description: "Permite simular procesos de automatización industrial y aprender principios de robótica y control.",
    applications: ["Aprendizaje de robótica","Simulación de procesos industriales","Programación de movimientos automatizados","Prácticas educativas en automatización"],
    status: "disponible", units: 1, category: "Robótica" },
  { title: "Cortadora CNC", subtitle: "Fabricación con control computarizado",
    description: "Fabrica piezas de alta precisión a partir de diseños digitales mediante procesos de corte automatizados.",
    applications: ["Piezas estructurales","Prototipos industriales","Diseño y fabricación de productos","Maquetas y elementos técnicos"],
    status: "disponible", units: 1, category: "Fabricación" },
  { title: "Cortadora láser", subtitle: "Corte y grabado de alta precisión",
    description: "Permite cortar y grabar materiales como madera y acrílico con gran detalle.",
    applications: ["Maquetas arquitectónicas","Piezas decorativas","Señalización y diseño gráfico","Prototipos"],
    status: "disponible", units: 1, category: "Fabricación" },
  { title: "Gafas de realidad virtual", subtitle: "Experiencias tecnológicas inmersivas",
    description: "Facilitan la interacción con entornos digitales para aprendizaje y experimentación.",
    applications: ["Simulaciones educativas","Exploración de modelos 3D","Experiencias interactivas","Visualización de proyectos"],
    status: "disponible", units: 4, category: "Inmersivo" },
  { title: "Impresora 3D en resina", subtitle: "Alta precisión y detalle",
    description: "Ideal para piezas complejas y prototipos que requieren gran calidad de acabado.",
    applications: ["Piezas detalladas","Modelos pequeños","Prototipos de alta precisión"],
    status: "reservada", units: 1, category: "Fabricación" },
  { title: "Impresoras 3D FDM", subtitle: "Fabricación de objetos tridimensionales",
    description: "Convierte modelos digitales en prototipos físicos para validar ideas y funcionalidades.",
    applications: ["Desarrollo de prototipos","Piezas funcionales","Modelos educativos","Diseño de productos"],
    status: "disponible", units: 6, category: "Fabricación" },
  { title: "Microcontroladores", subtitle: "Programación y desarrollo electrónico",
    description: "Dispositivos programables para proyectos de robótica, automatización y electrónica aplicada.",
    applications: ["Control de sensores y actuadores","Automatización de sistemas","Prototipos electrónicos","Proyectos de robótica"],
    status: "disponible", units: 12, category: "Electrónica" },
  { title: "Plotter y scanner 3D", subtitle: "Impresión y digitalización avanzada",
    description: "Herramientas para impresión de gran formato y captura digital de objetos reales.",
    applications: ["Impresión de planos y carteles","Material gráfico educativo","Ingeniería inversa","Conservación y modificación de modelos"],
    status: "disponible", units: 2, category: "Digitalización" },
]
