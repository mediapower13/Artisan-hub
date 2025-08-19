"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isDark = theme === "dark"

  return (
    <Button 
      onClick={toggleTheme}
      {...({ variant: "ghost", size: "icon" } as any)}
      className="relative h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 border-0"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400 transition-all duration-300 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:rotate-12" />
      )}
    </Button>
  )
}
