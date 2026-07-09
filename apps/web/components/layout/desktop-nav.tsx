import Link from "next/link"
import { UsersIcon, CpuIcon, FolderKanbanIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { centroLinks } from "./nav-links"
import { LinkItem } from "@/components/shared/shared"

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* Centro dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-1.5 bg-transparent">
            <UsersIcon className="size-4" />
            Nosotros
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-1 pr-1.5 pb-1.5">
            <div className="w-sm space-y-1 rounded-none border bg-card p-2 shadow">
              {centroLinks.map((item, i) => (
                <NavigationMenuLink
                  key={`centro-${i}`}
                  render={<LinkItem {...item} />}
                />
              ))}
            </div>
            <div className="p-2">
              <p className="text-sm text-muted-foreground">
                {"¿Quieres visitarnos? "}
                <a
                  className="font-medium text-foreground hover:underline"
                  href="/contacto"
                >
                  Contáctanos
                </a>
              </p>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/tecnologias" />}
            className={cn(navigationMenuTriggerStyle(), "gap-1.5")}
          >
            <CpuIcon className="size-4" />
            Tecnologías
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/portafolio" />}
            className={cn(navigationMenuTriggerStyle(), "gap-1.5")}
          >
            <FolderKanbanIcon className="size-4" />
            Portafolio
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
