import { DecorIcon } from "@/components/ui/decor-icon"
import { QuoteIcon } from "lucide-react"

type Testimonial = {
  quote: string
  name: string
  role: string
  company?: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
    name: "Shadcn",
    role: "Founder",
    company: "Shadcn UI",
  },
  {
    quote:
      "Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
    name: "Guillermo Rauch",
    role: "CEO",
    company: "Vercel",
  },

  {
    quote:
      "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
    name: "Elon Musk",
    role: "CEO",
    company: "X.com",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative w-full border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="relative grid md:grid-cols-[2fr_1px_1fr]">
        <div className="divide-y">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div key={testimonial.name} className="relative">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="relative h-px bg-border md:h-auto md:w-px" />
        <div className="flex h-full w-full items-center justify-center">
          <TestimonialCard testimonial={testimonials[2] as Testimonial} />
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, company } = testimonial

  return (
    <figure className="group relative px-12 py-8 transition-colors hover:bg-muted/20 md:px-16 md:py-10">
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-right"
      />
      <QuoteIcon
        aria-hidden="true"
        className="mb-4 size-12 stroke-1 text-muted-foreground"
      />

      <blockquote className="mb-6 text-base font-normal text-foreground md:text-lg">
        &quot;{quote}&quot;
      </blockquote>

      <figcaption className="flex flex-col gap-0.5">
        <cite className="text-lg font-medium text-foreground not-italic">
          {name}
        </cite>
        <p className="text-sm text-muted-foreground">
          {role}
          {company && `, ${company}`}
        </p>
      </figcaption>
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-right"
      />
    </figure>
  )
}
