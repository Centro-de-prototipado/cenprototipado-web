import { cn } from "@/lib/utils"
import type React from "react"
import { GridPattern } from "@/components/ui/grid-pattern"

import { DecorIcon } from "@/components/ui/decor-icon"
import {
  ZapIcon,
  CpuIcon,
  FingerprintIcon,
  PencilIcon,
  Settings2Icon,
  SparklesIcon,
} from "lucide-react"

type FeatureType = {
  title: string
  icon: React.ReactNode
  description: string
}

export function FeatureSection() {
  return (
    <section className="relative w-full border-b">
      <div className="relative px-12 py-16 md:px-16 md:py-30">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div
          className={cn(
            "mx-auto max-w-3xl text-center",
            "animate-in delay-800 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
        >
          <h2 className="text-3xl font-bold text-balance md:text-5xl lg:font-black">
            Explora, aprende y crea con tecnologia.
          </h2>
          <p className="mt-4 text-sm text-balance text-muted-foreground md:text-base">
            Un espacio abierto al publico para convertir ideas en proyectos
            reales con fabricacion digital, robotica y experiencias STEM.
          </p>
        </div>
      </div>

      <div className="relative border-t">
        <div className="grid grid-cols-2 gap-px bg-background/40 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </div>
    </section>
  )
}

export function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  feature: FeatureType
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden border-border px-6 py-8 transition-colors hover:bg-background/50 md:px-8 md:py-10",
        className
      )}
      {...props}
    >
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-right"
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          className="absolute inset-0 size-full stroke-foreground/20"
          height={40}
          width={40}
          x={20}
        />
      </div>
      <div className="[&_svg]:size-6 [&_svg]:text-foreground/75">
        {feature.icon}
      </div>
      <h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
      <p className="relative z-20 mt-2 text-xs font-light text-muted-foreground">
        {feature.description}
      </p>
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-right"
      />
    </div>
  )
}

const features: FeatureType[] = [
  {
    title: "Innovacion abierta",
    icon: <ZapIcon />,
    description:
      "Impulsamos proyectos colaborativos para transformar ideas en prototipos con impacto educativo y social.",
  },
  {
    title: "Visitas academicas",
    icon: <CpuIcon />,
    description:
      "Recibimos instituciones universitarias para explorar tecnologias y conocer metodologias de creacion aplicada.",
  },
  {
    title: "Impresion y fabricacion",
    icon: <FingerprintIcon />,
    description:
      "Trabajamos con impresion 3D, corte laser, CNC y escaneo 3D para materializar ideas con precision.",
  },
  {
    title: "Realidad virtual y robotica",
    icon: <PencilIcon />,
    description:
      "Integramos experiencias inmersivas, microcontroladores y fischertechnik para aprender haciendo.",
  },
  {
    title: "Formacion docente STEM",
    icon: <Settings2Icon />,
    description:
      "Iniciamos capacitaciones para profesores de aulas STEM con metodologias innovadoras y herramientas digitales.",
  },
  {
    title: "Centro abierto al publico",
    icon: <SparklesIcon />,
    description:
      "Si tienes una idea, un proyecto o curiosidad por crear, ven y desarrolla tu propuesta con nuestro equipo.",
  },
]
