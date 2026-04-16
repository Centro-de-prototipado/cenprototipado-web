"use client"

import { Logo } from "@/components/shared/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  LayoutGridIcon,
  BarChart3Icon,
  BriefcaseIcon,
  UsersIcon,
  PlugIcon,
  KeyRoundIcon,
  SettingsIcon,
  SendIcon,
  HelpCircleIcon,
  BookOpenIcon,
} from "lucide-react"

export type SidebarNavItem = {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
}

type SidebarSection = {
  label: string
  items: SidebarNavItem[]
}

const navSections: SidebarSection[] = [
  {
    label: "Product",
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: <LayoutGridIcon />,
        isActive: true,
      },
      {
        title: "Analytics",
        url: "#",
        icon: <BarChart3Icon />,
      },
      {
        title: "Projects",
        url: "#",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Team",
        url: "#",
        icon: <UsersIcon />,
      },
      {
        title: "Integrations",
        url: "#",
        icon: <PlugIcon />,
      },
      {
        title: "API Keys",
        url: "#",
        icon: <KeyRoundIcon />,
      },
    ],
  },

  {
    label: "Administration",
    items: [
      {
        title: "Settings",
        url: "#",
        icon: <SettingsIcon />,
      },
    ],
  },
]

const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Feedback",
    url: "#",
    icon: <SendIcon data-icon="inline-start" />,
  },
  {
    title: "Help Center",
    url: "#",
    icon: <HelpCircleIcon />,
  },

  {
    title: "Documentation",
    url: "#",
    icon: <BookOpenIcon />,
  },
]

const user = {
  name: "Shaban Haider",
  email: "shaban@efferd.com",
  avatar: "https://github.com/shabanhr.png",
}

export function AppSidebar() {
  return (
    <Sidebar
      className="static min-h-full *:data-[slot=sidebar-inner]:bg-background"
      collapsible="offcanvas"
      variant="sidebar"
    >
      <SidebarHeader className="relative h-14 justify-center px-2 py-0">
        <a
          className="flex h-11 w-max items-center justify-center rounded-lg px-3 hover:bg-muted dark:hover:bg-muted/50"
          href="#link"
        >
          <Logo className="h-7" />
          <span className="sr-only">Centro de Prototipado</span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.title}
                    render={<a href={item.url} />}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <SidebarMenu className="border-t p-2">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="text-muted-foreground"
                isActive={item.isActive ?? false}
                size="sm"
                render={<a href={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
