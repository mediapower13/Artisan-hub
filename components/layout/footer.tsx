import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/unilorin-logo.png"
                alt="University of Ilorin Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold text-unilorin-purple">UNILORIN</h3>
                <p className="text-sm text-muted-foreground">Artisan Community</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students with skilled artisans to learn practical skills and build a stronger community.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-unilorin-purple">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-unilorin-purple">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-unilorin-purple">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground">
                  Browse Artisans
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-sm text-muted-foreground hover:text-foreground">
                  Learn Skills
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Join Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/marketplace?category=Fashion%20%26%20Tailoring"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Fashion & Tailoring
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=Technology%20%26%20Repairs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Technology & Repairs
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=Beauty%20%26%20Wellness"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Beauty & Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=Food%20%26%20Catering"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Food & Catering
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">University of Ilorin, Ilorin, Kwara State</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+234 803 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">info@unilorin-artisan.edu.ng</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 University of Ilorin Artisan Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
