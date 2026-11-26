import { verificarCredencial } from "@/lib/aprende/credenciales"
import { renderCertificadoPdf } from "@/lib/pdf/certificado-pdf"

// PDF del certificado: /certificado/CP-XXXX-XXXX. Público por código, igual que la página
// de verificación (el código no expone correo ni id de la persona).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params
  const credencial = await verificarCredencial(codigo)
  if (!credencial)
    return new Response("Certificado no encontrado", { status: 404 })
  if (credencial.revocada)
    return new Response("Este certificado fue anulado", { status: 410 })

  const pdf = await renderCertificadoPdf(credencial)
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-${credencial.codigo}.pdf"`,
      "Cache-Control": "private, max-age=300",
    },
  })
}
