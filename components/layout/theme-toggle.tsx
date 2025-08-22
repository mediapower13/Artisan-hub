"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        {...({ variant: "ghost", size: "icon" } as any)}
        className="h-9 w-9 rounded-full"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Cycle order: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...({ variant: "ghost", size: "icon" } as any)}
          onClick={cycleTheme}
          aria-label="Toggle theme"
          className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 relative"
        >
          {/* Render icon according to current theme for immediate feedback */}
          {theme === "light" && (
            <Sun className="h-[1.2rem] w-[1.2rem] text-slate-700" />
          )}
          {theme === "dark" && (
            <Moon className="h-[1.2rem] w-[1.2rem] text-slate-300" />
          )}
          {theme === "system" && (
            <Monitor className="h-[1.2rem] w-[1.2rem] text-slate-600" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <Sun className="mr-2 h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <Moon className="mr-2 h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <Monitor className="mr-2 h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
