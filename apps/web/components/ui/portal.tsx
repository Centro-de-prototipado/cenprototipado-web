import { cn } from "@/lib/utils"
import React from "react"
import { createPortal } from "react-dom"

function Portal({ className, ...props }: React.ComponentProps<"div">) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // Lock scroll on <html> (the real scrolling element), not <body> — setting
    // overflow:hidden on body forces its overflow-x to also become non-visible,
    // which turns it into a scroll-clipping ancestor and silently breaks the
    // header's position: sticky while the menu is open.
    const html = document.documentElement
    const originalStyle = window.getComputedStyle(html).overflow
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const originalPaddingRight = document.body.style.paddingRight

    html.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      html.style.overflow = originalStyle
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <div
      className={cn("fixed inset-0 isolate z-40 flex flex-col", className)}
      {...props}
    />,
    document.body
  )
}

function PortalBackdrop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-1 bg-background/95 backdrop-blur-sm duration-500 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 supports-backdrop-filter:bg-background/60",
        className
      )}
      {...props}
    />
  )
}

export { Portal, PortalBackdrop }
