export type TeamMember = {
  name: string
  role: string
  portrait: string
  bio?: string
  linkedin?: string
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function createPortraitDataUri(
  name: string,
  accent: string,
  accent2: string
) {
  const initials = initialsFromName(name)
  const svg = `
    <svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${accent2}" />
        </linearGradient>
        <radialGradient id="light" cx="35%" cy="24%" r="70%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.45)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" rx="60" fill="url(#bg)" />
      <circle cx="180" cy="140" r="260" fill="rgba(255,255,255,0.14)" />
      <circle cx="660" cy="860" r="260" fill="rgba(255,255,255,0.10)" />
      <rect x="70" y="70" width="660" height="860" rx="40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
      <path d="M80 730 C180 610, 300 560, 400 560 C500 560, 620 610, 720 730" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="18" stroke-linecap="round" />
      <g transform="translate(400 370)">
        <circle cx="0" cy="-110" r="120" fill="rgba(255,255,255,0.26)" />
        <path d="M-160 200 C-130 35, -75 -10, 0 -10 C75 -10, 130 35, 160 200" fill="rgba(255,255,255,0.24)" />
        <circle cx="-40" cy="-120" r="10" fill="rgba(255,255,255,0.7)" />
        <circle cx="40" cy="-120" r="10" fill="rgba(255,255,255,0.7)" />
        <path d="M-42 -78 C-18 -60, 18 -60, 42 -78" fill="none" stroke="rgba(255,255,255,0.72)" stroke-width="8" stroke-linecap="round" />
      </g>
      <text x="400" y="860" fill="white" font-size="140" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">${initials}</text>
      <rect x="70" y="70" width="660" height="860" rx="40" fill="url(#light)" />
    </svg>
  `

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export type FaqItem = { q: string; a: string }

export type Technology = {
  title: string
  subtitle: string
  description: string
  applications: string[]
  status: "disponible" | "reservada"
  units: number
  category: string
}