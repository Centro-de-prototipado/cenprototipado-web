import { DecorIcon } from "@/components/ui/decor-icon"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqsSection() {
  return (
    <section className="relative w-full border-b" id="preguntas-frecuentes">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="relative grid w-full md:grid-cols-2">
        <div className="flex flex-col justify-center border-b px-12 py-20 md:border-r md:border-b-0 md:py-50">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-balance md:text-5xl lg:font-black">
              Preguntas frecuentes
            </h2>
            <p className="text-muted-foreground">
              Respuestas sobre servicios, tecnologias y formas de participar en
              las actividades del Centro de Prototipado.
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
          <Accordion className="rounded-none-none border-y-0 border-t border-b bg-background/40 transition-colors hover:bg-background/50">
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
    title: "¿Que es el Centro de Prototipado?",
    content:
      "Es un espacio de innovacion y desarrollo tecnologico donde transformamos ideas en prototipos mediante metodologias de aprendizaje practico.",
  },
  {
    id: "item-2",
    title: "¿Que tecnologias puedo encontrar?",
    content:
      "Contamos con impresion 3D, corte y grabado laser, CNC, escaneo 3D, realidad virtual, microcontroladores y robotica educativa con fischertechnik.",
  },
  {
    id: "item-3",
    title: "¿Quienes pueden visitar el Centro?",
    content:
      "El Centro esta abierto al publico. Recibimos estudiantes, docentes, instituciones y comunidad interesada en crear y experimentar con tecnologia.",
  },
  {
    id: "item-4",
    title: "¿Como puedo participar en actividades del Centro?",
    content:
      "Puedes participar mediante visitas guiadas, proyectos colaborativos, talleres y procesos de formacion segun tu perfil e interes.",
  },
  {
    id: "item-5",
    title: "¿El Centro tambien realiza formacion docente?",
    content:
      "Si. Iniciamos capacitaciones para profesores de aulas STEM orientadas al fortalecimiento pedagogico y tecnologico.",
  },
  {
    id: "item-6",
    title: "¿Donde estan ubicados?",
    content:
      "Estamos en el Museo Interactivo Samoga, segundo piso. Puedes acercarte para conocer nuestros servicios y actividades.",
  },
  {
    id: "item-7",
    title: "¿Puedo llevar una idea o proyecto propio?",
    content:
      "Claro. Si tienes una idea, un proyecto o simplemente curiosidad por crear, te acompanamos para convertirla en un prototipo funcional.",
  },
]
