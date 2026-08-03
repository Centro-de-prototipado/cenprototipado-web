import type { Metadata } from "next"

import { AprendeClient } from "@/components/sections/aprende-client"
import { channelUrl } from "@/lib/youtube/client"
import { getTutorials } from "@/lib/youtube/videos"

export const metadata: Metadata = {
  title: "Aprende con nosotros",
  description:
    "Tutoriales en video del Centro de Prototipado: impresión 3D, corte láser, CNC, realidad virtual y preparación de archivos para fabricación digital.",
}

export default async function AprendePage() {
  const { videos, playlists } = await getTutorials()

  return (
    <AprendeClient
      videos={videos}
      playlists={playlists}
      channelUrl={channelUrl()}
    />
  )
}
