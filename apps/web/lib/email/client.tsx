import { Resend } from "resend"
import { render } from "@react-email/components"
import { SolicitudEmail, subjectFor } from "./solicitud-email"
import type { SolicitudData } from "@/lib/forms/schemas"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarSolicitudEmail({
  data,
  pdf,
}: {
  data: SolicitudData
  pdf?: Buffer
}): Promise<void> {
  const html = await render(<SolicitudEmail data={data} />)
  await resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: process.env.CONTACT_TO_EMAIL as string,
    replyTo: data.correo,
    subject: subjectFor(data),
    html,
    attachments: pdf
      ? [{ filename: `solicitud-${data.type}.pdf`, content: pdf }]
      : undefined,
  })
}
