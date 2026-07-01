import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/site-config"

export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0d12",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#3dbbd4",
          }}
        >
          Universidad Nacional de Colombia · Sede Manizales
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Centro de Prototipado
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            color: "#a8b0bd",
            maxWidth: 900,
          }}
        >
          Fabricación digital, realidad inmersiva y robótica al servicio de la comunidad.
        </div>
      </div>
    ),
    { ...size }
  )
}
