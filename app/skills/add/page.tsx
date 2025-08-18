"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  X, 
  Upload, 
  BookOpen, 
  Clock, 
  Users, 
  DollarSign,
  Award,
  CheckCircle
} from "lucide-react"

const categories = [
  "Fashion & Tailoring",
  "Technology & Programming", 
  "Arts & Crafts",
  "Beauty & Cosmetics",
  "Food & Culinary",
  "Photography & Videography",
  "Music & Entertainment",
  "Sports & Fitness",
  "Business & Entrepreneurship",
  "Other"
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "No prior experience needed" },
  { value: "intermediate", label: "Intermediate", description: "Some basic knowledge required" },
  { value: "advanced", label: "Advanced", description: "Extensive experience needed" }
]

export default function AddSkillPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: "",
    price: "",
    maxStudents: "",
    requirements: [""],
    syllabus: [""],
    images: [] as string[]
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: "requirements" | "syllabus", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: "requirements" | "syllabus") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: "requirements" | "syllabus", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty requirements and syllabus items
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        syllabus: formData.syllabus.filter(item => item.trim()),
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents)
      }

      // Here you would normally send to your API
      console.log("Skill data:", cleanedData)
      
      toast({
        title: "Skill Added Successfully!",
        description: "Your skill has been submitted for review and will be live soon.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Teach a New Skill
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share your expertise with the UNILORIN community
              </p>
            </div>
          </div>
          
          {/* Steps Indicator */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-300">
              Fill out the form below to add your skill to the marketplace
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Tell us about the skill you want to teach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Skill Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Professional Tailoring for Beginners"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what students will learn, your teaching approach, and why they should choose your skill..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Course Details</span>
              </CardTitle>
              <CardDescription>
                Specify the practical details of your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 4 weeks, 10 hours"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="5000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxStudents">Max Students *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="maxStudents"
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                      placeholder="20"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>
                What do students need before taking this course?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                      placeholder="e.g., Basic sewing machine, Measuring tape"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        {...({ type: "button", variant: "outline", size: "icon" } as any)}
                        onClick={() => removeArrayItem("requirements", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  {...({ type: "button", variant: "outline" } as any)}
                  onClick={() => addArrayItem("requirements")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Syllabus */}
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
              <CardDescription>
                Break down what you'll teach in each session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.syllabus.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge className="min-w-fit bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {index + 1}
                    </Badge>
                    <Input
                      value={item}
                      onChange={(e) => handleArrayChange("syllabus", index, e.target.value)}
                      placeholder="e.g., Introduction to pattern making"
                    />
                    {formData.syllabus.length > 1 && (
                      <Button
                        {...({ type: "button", variant: "outline", size: "icon" } as any)}
                        onClick={() => removeArrayItem("syllabus", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  {...({ type: "button", variant: "outline" } as any)}
                  onClick={() => addArrayItem("syllabus")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              {...({ type: "button", variant: "outline" } as any)}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Add Skill"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
