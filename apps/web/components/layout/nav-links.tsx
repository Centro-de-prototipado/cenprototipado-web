import type { LinkItemType } from "@/components/shared/shared"
import {
  UsersIcon,
  HandshakeIcon,
  StarIcon,
  CpuIcon,
  FolderKanbanIcon,
} from "lucide-react"

export const centroLinks: LinkItemType[] = [
  {
    label: "Quiénes somos",
    href: "/centro",
    description: "Misión, visión y enfoque del Centro de Prototipado",
    icon: <UsersIcon />,
  },
  {
    label: "Equipo de trabajo",
    href: "/centro#equipo",
    description: "Perfiles del equipo interdisciplinario",
    icon: <StarIcon />,
  },
  {
    label: "Articulación STEM",
    href: "/centro#articulacion-stem",
    description: "Proyectos articulados con Aulas STEM de Caldas y Manizales",
    icon: <HandshakeIcon />,
  },
]

export const exploreLinks: LinkItemType[] = [
  {
    label: "Tecnologías",
    href: "/tecnologias",
    description: "Impresión 3D, corte láser, CNC, RV y más equipamiento",
    icon: <CpuIcon />,
  },
  {
    label: "Portafolio",
    href: "/portafolio",
    description: "Proyectos desarrollados en educación, industria y comunidad",
    icon: <FolderKanbanIcon />,
  },
]
