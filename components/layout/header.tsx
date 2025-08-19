"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { 
  Menu, 
  User, 
  LogOut, 
  BookOpen, 
  Home, 
  Settings, 
  Bell,
  ShoppingBag,
  Award,
  MessageCircle
} from "lucide-react"

// Type assertion for button props
type ButtonProps = React.ComponentProps<typeof Button>

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Skills", href: "/skills", icon: BookOpen },
  ]

  const userNavigation = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard", icon: Award },
        { name: "Messages", href: "/messages", icon: MessageCircle },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    : []

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      {/* Modern Professional Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled 
          ? 'bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 shadow-sm' 
          : 'bg-white dark:bg-black border-b border-slate-100 dark:border-slate-900'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section with UNILORIN Branding */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center space-x-3">
                <Image
                  src="/placeholder-logo.svg"
                  alt="UNILORIN Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    UNILORIN
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">
                    Student Artisan Hub
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${isActive(item.href)
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                href="/skills/add"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                <Award className="h-4 w-4" />
                <span>Teach a Skill</span>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu or Auth Buttons */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      {...({ variant: "ghost" } as ButtonProps)} 
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={user ? user.fullName : "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">
                          {user ? user.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 mt-2" 
                    align="end"
                  >
                    <DropdownMenuLabel className="font-semibold">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm">{user ? user.fullName : "User"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userNavigation.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center space-x-2 cursor-pointer">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    {...({ variant: "ghost" } as ButtonProps)}
                    onClick={() => router.push("/login")}
                    className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    Sign in
                  </Button>
                  <Button 
                    onClick={() => router.push("/register")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    Get started
                  </Button>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    {...({ variant: "ghost", size: "icon" } as ButtonProps)}
                    className="md:hidden h-9 w-9"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  className="w-80 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/placeholder-logo.svg"
                          alt="UNILORIN"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                            UNILORIN
                          </h1>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Student Artisan Hub</p>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-8 space-y-6">
                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200
                            ${isActive(item.href)
                              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      <Link
                        href="/skills/add"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-base font-medium transition-colors duration-200"
                      >
                        <Award className="h-5 w-5" />
                        <span>Teach a Skill</span>
                      </Link>
                    </nav>

                    {/* Mobile User Section */}
                    {isAuthenticated ? (
                      <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center space-x-3 px-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt={user ? user.fullName : "User"}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                              {user ? user.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {user ? user.fullName : "User"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        
                        <nav className="space-y-1">
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Log out</span>
                          </button>
                        </nav>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <Button 
                          {...({ variant: "outline" } as ButtonProps)}
                          onClick={() => {
                            router.push("/login")
                            setIsOpen(false)
                          }}
                          className="w-full justify-start"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Sign in
                        </Button>
                        <Button 
                          onClick={() => {
                            router.push("/register")
                            setIsOpen(false)
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          Get started
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-16"></div>
    </>
  )
}
