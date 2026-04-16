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
} from "lucide-react"

export const productLinks: LinkItemType[] = [
  {
    label: "Aulas STEM",
    href: "#",
    description: "Implementación en municipios de Caldas",
    icon: <GlobeIcon />,
  },
  {
    label: "Aulas STEAM",
    href: "#",
    description: "Implementación en instituciones oficiales de Manizales",
    icon: <LayersIcon />,
  },
  {
    label: "Formación docente",
    href: "#",
    description: "Capacitación en enfoque STEAM y aprendizaje por proyectos",
    icon: <UserPlusIcon />,
  },
  {
    label: "Impacto territorial",
    href: "#",
    description: "Seguimiento por fases en municipios y subregiones",
    icon: <BarChart3Icon />,
  },
  {
    label: "Dotación tecnológica",
    href: "#",
    description: "Impresión 3D, CNC láser, robótica y programación",
    icon: <PlugIcon />,
  },
  {
    label: "Centro de Prototipado",
    href: "#",
    description: "Innovación pedagógica y fortalecimiento empresarial",
    icon: <CodeIcon />,
  },
]

export const companyLinks: LinkItemType[] = [
  {
    label: "Sobre el proyecto",
    href: "#",
    description: "Conoce la estrategia STEM y STEAM en Caldas",
    icon: <UsersIcon />,
  },
  {
    label: "Resultados",
    href: "#",
    description: "Avances e hitos por municipio e institución",
    icon: <StarIcon />,
  },
  {
    label: "Alianzas",
    href: "#",
    icon: <HandshakeIcon />,
    description: "Trabajo articulado con alcaldías e instituciones educativas",
  },
]

export const companyLinks2: LinkItemType[] = [
  {
    label: "Términos del servicio",
    href: "#",
    icon: <FileTextIcon />,
  },
  {
    label: "Política de privacidad",
    href: "#",
    icon: <ShieldIcon />,
  },
  {
    label: "Política de devoluciones",
    href: "#",
    icon: <RotateCcwIcon />,
  },
  {
    label: "Blog",
    href: "#",
    icon: <LeafIcon />,
  },
  {
    label: "Centro de ayuda",
    href: "#",
    icon: <HelpCircleIcon />,
  },
]
