"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button 
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      )}
    </Button>
  )
}
