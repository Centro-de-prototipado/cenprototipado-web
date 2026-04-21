import { Logo } from "@/components/shared/logo"

const navLinks = [
  { href: "/centro", label: "Centro" },
  { href: "/tecnologias", label: "Tecnologías" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/contacto", label: "Contacto" },
]

const socialLinks = [
  {
    href: "#",
    label: "Instagram",
    icon: <XIcon />,
  },
]

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl border-b px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-7" />
          </div>
          <div className="flex items-center">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                aria-label={label}
                href={href}
                className="rounded-none-none inline-flex h-9 w-9 items-center justify-center hover:bg-muted"
              >
                <span className="size-4">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <nav>
          <ul className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground md:gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a className="hover:text-foreground" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center justify-between gap-4 border-t py-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Centro de Prototipado | Cuenta
          institucional UNAL
        </p>

        <p className="inline-flex items-center gap-1">
          <span>Desarrollado por</span>
          <a
            aria-label="x/twitter"
            className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            Centro de Prototipado
          </a>
        </p>
      </div>
    </footer>
  )
}

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m18.9,1.153h3.682l-8.042,9.189,9.46,12.506h-7.405l-5.804-7.583-6.634,7.583H.469l8.6-9.831L0,1.153h7.593l5.241,6.931,6.065-6.931Zm-1.293,19.494h2.039L6.482,3.239h-2.19l13.314,17.408Z" />
    </svg>
  )
}
