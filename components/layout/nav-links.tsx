import type { LinkItemType } from "@/components/shared/shared"
import {
  GlobeIcon,
  LayersIcon,
  UserPlusIcon,
  BarChart3Icon,
  PlugIcon,
  CodeIcon,
  UsersIcon,
  StarIcon,
  HandshakeIcon,
  FileTextIcon,
  ShieldIcon,
  RotateCcwIcon,
  LeafIcon,
  HelpCircleIcon,
  FolderKanbanIcon,
} from "lucide-react"

export const productLinks: LinkItemType[] = [
  {
    label: "Tecnologias del Centro",
    href: "/tecnologias",
    description: "Inventario, capacidades y equipos disponibles",
    icon: <GlobeIcon />,
  },
  {
    label: "Fabricacion digital",
    href: "/tecnologias",
    description: "Impresion 3D, corte laser, CNC y escaneo 3D",
    icon: <LayersIcon />,
  },
  {
    label: "Formacion docente",
    href: "/institucional#articulacion-stem",
    description: "Capacitacion en enfoque STEM y aprendizaje por proyectos",
    icon: <UserPlusIcon />,
  },
  {
    label: "Proyectos desarrollados",
    href: "/institucional#casos-exito",
    description: "Proyectos desarrollados con enfoque educativo y social",
    icon: <BarChart3Icon />,
  },
  {
    label: "Dotacion tecnologica",
    href: "/tecnologias",
    description: "Equipos, software y experiencias para prototipar",
    icon: <PlugIcon />,
  },
  {
    label: "Centro de Prototipado",
    href: "/institucional",
    description: "Quienes somos, mision, vision y equipo",
    icon: <CodeIcon />,
  },
  {
    label: "Portafolio",
    href: "/portafolio",
    description: "Proyectos desarrollados y resultados interactivos",
    icon: <FolderKanbanIcon />,
  },
]

export const companyLinks: LinkItemType[] = [
  {
    label: "Quienes somos",
    href: "/institucional",
    description: "Conoce la estrategia STEM y STEAM en Caldas",
    icon: <UsersIcon />,
  },
  {
    label: "Equipo de trabajo",
    href: "/institucional#equipo",
    description: "Equipo con perfiles y retratos visuales",
    icon: <StarIcon />,
  },
  {
    label: "Articulacion STEM",
    href: "/institucional#articulacion-stem",
    icon: <HandshakeIcon />,
    description: "Trabajo articulado con alcaldías e instituciones educativas",
  },
]

export const companyLinks2: LinkItemType[] = [
  {
    label: "Tecnologias",
    href: "/tecnologias",
    icon: <FileTextIcon />,
  },
  {
    label: "Proyectos desarrollados",
    href: "/institucional#casos-exito",
    icon: <ShieldIcon />,
  },
  {
    label: "Contacto",
    href: "/#contacto",
    icon: <RotateCcwIcon />,
  },
  {
    label: "Portafolio",
    href: "/portafolio",
    icon: <LeafIcon />,
  },
  {
    label: "Ayuda",
    href: "/#preguntas-frecuentes",
    icon: <HelpCircleIcon />,
  },
]
