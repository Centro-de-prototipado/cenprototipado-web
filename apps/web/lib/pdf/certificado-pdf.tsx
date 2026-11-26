import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer"
import QRCode from "qrcode"
import { CEN_LOGO_PNG } from "./logo"
import {
  fechaLarga,
  horasTexto,
  urlVerificacion,
  type Credencial,
} from "@/lib/aprende/credenciales"

// Sin guiones de partición: la URL y los nombres no se cortan con «-».
Font.registerHyphenationCallback((palabra) => [palabra])

// Certificado del Centro (A4 horizontal) con la paleta institucional de sus formatos y un
// QR que lleva a la página pública de verificación.
const C = {
  primary: "#003366",
  secondary: "#004b8d",
  lightBlue: "#e6f0ff",
  accent: "#06b6d4",
  text: "#2c3e50",
  muted: "#7f8c8d",
}

const s = StyleSheet.create({
  page: { padding: 28, fontFamily: "Helvetica", color: C.text },
  marco: { flex: 1, borderWidth: 2, borderColor: C.primary, padding: 6 },
  interior: {
    flex: 1,
    borderWidth: 0.75,
    borderColor: C.accent,
    paddingVertical: 30,
    paddingHorizontal: 54,
    alignItems: "center",
  },
  logo: { height: 52, objectFit: "contain", marginBottom: 18 },
  titulo: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  subtitulo: {
    fontSize: 10.5,
    color: C.muted,
    marginTop: 6,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  linea: {
    width: 90,
    height: 2,
    backgroundColor: C.accent,
    marginVertical: 18,
  },
  intro: { fontSize: 12, textAlign: "center", lineHeight: 1.5 },
  nombre: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.secondary,
    marginVertical: 12,
    textAlign: "center",
  },
  cuerpo: { fontSize: 12, textAlign: "center", lineHeight: 1.6, maxWidth: 560 },
  negrita: { fontFamily: "Helvetica-Bold" },
  pie: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
  },
  firma: { width: 220, alignItems: "center" },
  firmaLinea: {
    width: "100%",
    height: 1,
    backgroundColor: C.text,
    marginBottom: 5,
  },
  firmaTexto: { fontSize: 9, textAlign: "center" },
  qrCaja: { alignItems: "center", width: 130 },
  qr: { width: 82, height: 82 },
  codigo: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    color: C.primary,
  },
  verificar: { fontSize: 7, color: C.muted, marginTop: 2, textAlign: "center" },
})

function Certificado({ c, qr }: { c: Credencial; qr: string }) {
  const esCharla = c.tipo === "charla"
  return (
    <Document
      title={`Certificado ${c.codigo}`}
      author="Centro de Prototipado UNAL Manizales"
      language="es"
    >
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.marco}>
          <View style={s.interior}>
            <Image src={CEN_LOGO_PNG} style={s.logo} />
            <Text style={s.titulo}>
              {esCharla
                ? "Certificado de asistencia"
                : "Certificado de aprobación"}
            </Text>
            <Text style={s.subtitulo}>
              Universidad Nacional de Colombia · Sede Manizales
            </Text>
            <View style={s.linea} />
            <Text style={s.intro}>El Centro de Prototipado certifica que</Text>
            <Text style={s.nombre}>{c.nombre}</Text>
            <Text style={s.cuerpo}>
              {esCharla ? "asistió a la charla " : "aprobó el curso "}
              <Text style={s.negrita}>«{c.titulo}»</Text>
              {esCharla ? ", realizada el " : ", finalizado el "}
              {fechaLarga(c.fecha)}, con una intensidad de {horasTexto(c.horas)}
              .
            </Text>
            <View style={s.pie}>
              <View style={s.firma}>
                <View style={s.firmaLinea} />
                <Text style={s.firmaTexto}>Coordinación</Text>
                <Text style={s.firmaTexto}>
                  Centro de Prototipado · UNAL Manizales
                </Text>
              </View>
              <View style={s.qrCaja}>
                <Image src={qr} style={s.qr} />
                <Text style={s.codigo}>{c.codigo}</Text>
                <Text style={s.verificar}>
                  Verifica este certificado en{" "}
                  {urlVerificacion(c.codigo).replace(/^https?:\/\//, "")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function renderCertificadoPdf(c: Credencial) {
  const qr = await QRCode.toDataURL(urlVerificacion(c.codigo), {
    margin: 0,
    width: 300,
    color: { dark: "#003366" },
  })
  return renderToBuffer(<Certificado c={c} qr={qr} />)
}
