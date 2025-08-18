"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Menu, User, LogOut, BookOpen, Users, Home } from "lucide-react"

// Type assertion for button props
type ButtonProps = React.ComponentProps<typeof Button>

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: Users },
    { name: "Skills", href: "/skills", icon: BookOpen },
  ]

  const userNavigation = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Profile", href: "/profile" },
        { name: "Settings", href: "/settings" },
      ]
    : []

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-unilorin-purple">UNILORIN</h1>
              <p className="text-xs text-muted-foreground">Artisan Community</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button {...({ variant: "ghost" } as ButtonProps)} className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={user ? user.fullName : "User"}
                      />
                      <AvatarFallback className="bg-unilorin-purple text-white">
                        {user ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user?.userType}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button {...({ variant: "ghost" } as ButtonProps)} asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button {...({ variant: "ghost", size: "icon" } as ButtonProps)} className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent {...({ side: "right" } as any)} className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Image
                      src="/images/unilorin-logo.png"
                      alt="University of Ilorin Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold text-unilorin-purple">UNILORIN</h2>
                      <p className="text-xs text-muted-foreground">Artisan Community</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>

                  {isAuthenticated ? (
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={user ? user.fullName : "User"}
                          />
                          <AvatarFallback className="bg-unilorin-purple text-white">
                            {user ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.userType}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                          >
                            <User className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        <Button
                          {...({ variant: "ghost" } as ButtonProps)}
                          onClick={handleLogout}
                          className="justify-start px-3 text-red-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-2">
                      <Button {...({ variant: "outline" } as ButtonProps)} className="w-full bg-transparent" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
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
  )
}
