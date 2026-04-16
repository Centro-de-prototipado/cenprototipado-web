import { DecorIcon } from "@/components/ui/decor-icon"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqsSection() {
  return (
    <section className="relative w-full border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="relative grid w-full md:grid-cols-2">
        <div className="flex flex-col justify-center border-b px-12 py-20 md:border-r md:border-b-0 md:py-50">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-balance md:text-5xl lg:font-black">
              Preguntas frecuentes
            </h2>
            <p className="text-muted-foreground">
              Respuestas rápidas sobre el Centro de Prototipado como cuenta
              institucional UNAL y su trabajo en innovación educativa y
              desarrollo tecnológico.
            </p>
            <p className="text-muted-foreground">
              {"¿No encuentras la información que buscas? "}
              <a className="text-primary hover:underline" href="#">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
        <div className="relative flex flex-col justify-center">
          <Accordion className="rounded-none border-y-0">
            {faqs.map((item, index) => (
              <AccordionItem
                className="group relative"
                key={item.id}
                value={item.id}
              >
                {index < faqs.length - 1 && (
                  <DecorIcon className="left-0 size-3" position="bottom-left" />
                )}

                <AccordionTrigger className="px-6 py-4 hover:no-underline focus-visible:underline focus-visible:ring-0 md:px-8">
                  {item.title}
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-4 text-muted-foreground md:px-8">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

const faqs = [
  {
    id: "item-1",
    title: "¿Qué son las Aulas STEM y STEAM?",
    content:
      "Las Aulas STEM fortalecen formación en ciencia, tecnología, ingeniería y matemáticas; las Aulas STEAM integran además Artes para potenciar creatividad e innovación.",
  },
  {
    id: "item-2",
    title: "¿Dónde se implementa el proyecto?",
    content:
      "En los municipios de Caldas se desarrollan Aulas STEM y en instituciones educativas oficiales de Manizales se implementan Aulas STEAM, según lo definido normativamente.",
  },
  {
    id: "item-3",
    title: "¿Cómo avanza la implementación por fases?",
    content:
      "La implementación ha sido progresiva: Fase 1 con La Dorada, Marmato, Villamaría, Neira y Pácora; Fase 2 con Marquetalia, Victoria, Belalcázar, Palestina, San José y Aguadas; y una tercera fase proyectada para 12 municipios adicionales.",
  },
  {
    id: "item-4",
    title: "¿Cómo se eligen los equipos para cada aula?",
    content:
      "La dotación se define con la estrategia de Orientación Socio-Ocupacional (OSO), que considera actividades económicas del territorio e intereses de los estudiantes.",
  },
  {
    id: "item-5",
    title: "¿Qué incluye la formación para los profesionales?",
    content:
      "Antes de iniciar en territorio, reciben capacitación en enfoque STEAM, competencias del siglo XXI, aprendizaje basado en proyectos y uso y mantenimiento de equipos.",
  },
  {
    id: "item-6",
    title: "¿Qué equipos tienen las aulas?",
    content:
      "Las aulas cuentan con impresoras 3D, máquinas CNC de corte y grabado láser, kits de robótica y herramientas de programación, entre otros recursos.",
  },
  {
    id: "item-7",
    title: "¿Cómo se garantiza la sostenibilidad del proyecto?",
    content:
      "Los bienes se integran a inventarios oficiales de alcaldías o instituciones educativas, y la estrategia prioriza dejar capacidades instaladas para continuidad local.",
  },
]
