"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme
    if (stored) {
  setThemeState(stored)
    }
  }, [])

  const applyTheme = (t: Theme) => {
    if (typeof window === "undefined") return
    const root = window.document.documentElement

  // (no-op) apply theme silently

    if (disableTransitionOnChange) {
      root.classList.add("[&_*]:!transition-none")
      setTimeout(() => {
        root.classList.remove("[&_*]:!transition-none")
      }, 1)
    }

    root.classList.remove("light", "dark")

    if (t === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(t)
    }

    try {
      localStorage.setItem("theme", t)
    } catch (e) {
      // ignore storage errors in restrictive environments
    }

  // finished applying theme
  }

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted, enableSystem, disableTransitionOnChange])

  const value = {
    theme,
    setTheme: (t: Theme) => {
  setThemeState(t)
  applyTheme(t)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
