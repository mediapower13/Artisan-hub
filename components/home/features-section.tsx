import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Award, MessageCircle, Shield, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Expert Artisans",
      description: "Learn from verified professionals with years of experience in their craft",
      color: "text-unilorin-purple",
      bgColor: "bg-unilorin-purple/10",
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow comprehensive curricula designed to take you from beginner to expert",
      color: "text-unilorin-gold",
      bgColor: "bg-unilorin-gold/10",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates upon completion of your skills training",
      color: "text-unilorin-green",
      bgColor: "bg-unilorin-green/10",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with artisans for personalized guidance and support",
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      icon: Shield,
      title: "Verified Quality",
      description: "All artisans are verified and reviewed by the UNILORIN community",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      icon: Zap,
      title: "Flexible Learning",
      description: "Learn at your own pace with lifetime access to course materials",
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Why Choose Our Platform
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="text-unilorin-purple"> Master New Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform provides a comprehensive learning experience that connects you with the best artisans in the
            UNILORIN community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
