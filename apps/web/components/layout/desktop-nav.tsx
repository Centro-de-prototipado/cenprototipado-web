import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { centroLinks, exploreLinks } from "./nav-links"
import { LinkItem } from "@/components/shared/shared"

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {/* Centro dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
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

        {/* Explorar dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Explorar
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-1 pr-1.5 pb-1.5">
            <div className="w-sm space-y-1 rounded-none border bg-card p-2 shadow">
              {exploreLinks.map((item, i) => (
                <NavigationMenuLink
                  key={`explore-${i}`}
                  render={<LinkItem {...item} />}
                />
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
