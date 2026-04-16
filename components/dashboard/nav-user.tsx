"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  UserIcon,
  BellIcon,
  CreditCardIcon,
  SettingsIcon,
  LifeBuoyIcon,
  LogOutIcon,
} from "lucide-react"
import Link from "next/link"

type UserType = {
  name: string
  email: string
  avatar: string
}

const fallbackUser: UserType = {
  name: "Guest User",
  email: "guest@example.com",
  avatar: "https://avatar.vercel.sh/guest.png",
}

export function NavUser({ user }: { user?: UserType }) {
  const { isMobile } = useSidebar()
  const safeUser = user ?? fallbackUser

  return (
    <SidebarMenu className="border-t p-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton className="text-muted-foreground" />}
          >
            <Avatar className="size-5">
              <AvatarImage alt={safeUser.name} src={safeUser.avatar} />
              <AvatarFallback>{safeUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {safeUser.name.split(" ")[0]}
            </span>
            <ChevronsUpDownIcon className="ml-auto size-3!" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-48"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoyIcon />
                Help Center
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Link href="/" className="flex w-full items-center gap-1">
                <LogOutIcon />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
