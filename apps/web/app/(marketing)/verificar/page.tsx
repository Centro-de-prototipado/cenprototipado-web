import type { Metadata } from "next"
import { FormVerificar } from "@/components/aprende/form-verificar"

export const metadata: Metadata = {
  title: "Verificar certificado",
  description:
    "Comprueba que un certificado o insignia del Centro de Prototipado de la UNAL Manizales es auténtico.",
}

export default function Pagina() {
  return (
    <section className="flex flex-col gap-5 border-b px-8 py-14 lg:px-16 lg:py-20">
      <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
        Certificados
      </span>
      <h1 className="m-0 max-w-xl text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] sm:text-5xl">
        Verificar un certificado
      </h1>
      <p className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
        Escribe el código que aparece en el certificado, debajo del QR. Tiene el
        formato CP-XXXX-XXXX.
      </p>
      <FormVerificar />
    </section>
  )
}
