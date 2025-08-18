"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, BookOpen, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90"></div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-unilorin-purple/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-10 animate-float animate-delay-100">
        <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center animate-pulse-glow">
          <BookOpen className="h-8 w-8 text-unilorin-purple" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float animate-delay-300">
        <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center animate-pulse-glow">
          <Users className="h-6 w-6 text-unilorin-gold" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float animate-delay-500">
        <div className="w-14 h-14 glass-card rounded-full flex items-center justify-center animate-pulse-glow">
          <Award className="h-7 w-7 text-unilorin-green" />
        </div>
      </div>
      <div className="absolute top-60 right-10 animate-float animate-delay-200">
        <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-unilorin-gold" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6 animate-fade-in-up">
              <Badge
                variant="secondary"
                className="glass-card text-unilorin-purple border-unilorin-purple/30 animate-shimmer"
              >
                University of Ilorin Community Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-delay-100">
                Learn Skills from
                <span className="animate-text-gradient block mt-2">Expert Artisans</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl animate-delay-200">
                Connect with skilled artisans in the UNILORIN community. Learn practical skills, build your expertise,
                and join a thriving network of learners and creators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animate-delay-300">
              <Button size="lg" className="btn-enhanced bg-unilorin-purple hover:bg-unilorin-purple/90" asChild>
                <Link href="/skills">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-enhanced glass-card bg-transparent" asChild>
                <Link href="/marketplace">Browse Artisans</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 animate-fade-in-up animate-delay-400">
              <div className="text-center lg:text-left animate-card-hover">
                <div className="text-3xl font-bold text-unilorin-purple animate-pulse-glow">50+</div>
                <div className="text-sm text-muted-foreground">Expert Artisans</div>
              </div>
              <div className="text-center lg:text-left animate-card-hover">
                <div className="text-3xl font-bold text-unilorin-gold animate-pulse-glow">200+</div>
                <div className="text-sm text-muted-foreground">Skills Available</div>
              </div>
              <div className="text-center lg:text-left animate-card-hover">
                <div className="text-3xl font-bold text-unilorin-green animate-pulse-glow">1000+</div>
                <div className="text-sm text-muted-foreground">Students Learning</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animate-delay-500">
            <div className="relative z-10 animate-float">
              <Image
                src="/images/unilorin-logo.png"
                alt="University of Ilorin Logo"
                width={400}
                height={400}
                className="mx-auto opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-105"
                priority
              />
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-unilorin-purple/20 via-unilorin-gold/20 to-unilorin-green/20 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 glass-card rounded-full animate-float animate-delay-100"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 glass-card rounded-full animate-float animate-delay-300"></div>
            <div className="absolute top-1/2 -right-8 w-16 h-16 glass-card rounded-full animate-float animate-delay-200"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 glass-card rounded-full flex justify-center">
          <div className="w-1 h-3 bg-unilorin-purple rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
