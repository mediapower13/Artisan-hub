"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import type { User } from "@/lib/types"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as "student" | "artisan",
    // Student specific fields
    studentId: "",
    department: "",
    customDepartment: "",
    level: "",
    // Artisan specific fields
    businessName: "",
    specialization: "",
    customSpecialization: "",
    experience: "",
    location: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role
    ) {
      return "Please fill in all required fields"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    if (formData.role === "student" && (!formData.studentId || !formData.department || !formData.level)) {
      return "Please fill in all student information"
    }

    // Additional validation for custom department
    if (formData.role === "student" && formData.department === "Other" && !formData.customDepartment) {
      return "Please specify your department"
    }

    if (
      formData.role === "artisan" &&
      (!formData.businessName || !formData.specialization || !formData.experience || !formData.location)
    ) {
      return "Please fill in all artisan information"
    }

    // Additional validation for custom specialization
    if (formData.role === "artisan" && formData.specialization === "Other" && !formData.customSpecialization) {
      return "Please specify your specialization"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role as "student" | "artisan",
      phone: formData.phone,
      // Student specific data
      studentId: formData.role === "student" ? formData.studentId : undefined,
      department: formData.role === "student" ? (formData.department === "Other" ? formData.customDepartment : formData.department) : undefined,
      level: formData.role === "student" ? formData.level : undefined,
      // Artisan specific data (not used by backend, but kept for future)
      businessName: formData.role === "artisan" ? formData.businessName : undefined,
      location: formData.role === "artisan" ? formData.location : undefined,
      experienceYears: formData.role === "artisan" && formData.experience ? parseInt(formData.experience) : undefined,
      skills: formData.role === "artisan" && formData.specialization ? [(formData.specialization === "Other" ? formData.customSpecialization : formData.specialization)] : undefined,
    }

    const success = await register(userData)
    if (success) {
      onSuccess?.()
    } else {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Join UNILORIN Community</CardTitle>
        <CardDescription className="text-center">
          Create your account to connect with artisans and learn new skills
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@unilorin.edu.ng"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
                <Button
                  {...({ type: "button", variant: "ghost", size: "sm" } as any)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
                <Button
                  {...({ type: "button", variant: "ghost", size: "sm" } as any)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-gray-100">I am a *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "student" | "artisan") => handleInputChange("role", value)}
            >
              <SelectTrigger className="h-12 border-2 border-purple-300 bg-white dark:bg-gray-800 hover:border-purple-500 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 font-medium">
                <SelectValue placeholder="Select your role" className="text-gray-900 dark:text-gray-100" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
                <SelectItem value="student" className="hover:bg-purple-50 dark:hover:bg-purple-900/50 text-gray-900 dark:text-gray-100 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Student</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">I want to learn new skills</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="artisan" className="hover:bg-purple-50 dark:hover:bg-purple-900/50 text-gray-900 dark:text-gray-100 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Artisan</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">I want to teach my skills</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student-specific fields */}
          {formData.role === "student" && (
            <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Student Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Student ID *</Label>
                  <Input
                    id="studentId"
                    placeholder="e.g., 19/55HA001"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-900 dark:text-gray-100">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="h-12 border-2 border-blue-300 bg-white dark:bg-gray-800 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium">
                      <SelectValue placeholder="Select your department" className="text-gray-900 dark:text-gray-100" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
                      <SelectItem value="Computer Science" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Civil Engineering</SelectItem>
                      <SelectItem value="Chemical Engineering" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Chemical Engineering</SelectItem>
                      <SelectItem value="Business Administration" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Business Administration</SelectItem>
                      <SelectItem value="Economics" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Economics</SelectItem>
                      <SelectItem value="Accounting" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Accounting</SelectItem>
                      <SelectItem value="Mass Communication" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Mass Communication</SelectItem>
                      <SelectItem value="English Language" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">English Language</SelectItem>
                      <SelectItem value="Mathematics" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Mathematics</SelectItem>
                      <SelectItem value="Physics" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Physics</SelectItem>
                      <SelectItem value="Chemistry" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Chemistry</SelectItem>
                      <SelectItem value="Biology" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Biology</SelectItem>
                      <SelectItem value="Medicine" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Medicine</SelectItem>
                      <SelectItem value="Law" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Law</SelectItem>
                      <SelectItem value="Agriculture" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Agriculture</SelectItem>
                      <SelectItem value="Veterinary Medicine" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Veterinary Medicine</SelectItem>
                      <SelectItem value="Pharmacy" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Pharmacy</SelectItem>
                      <SelectItem value="Education" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Education</SelectItem>
                      <SelectItem value="Arts" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Arts</SelectItem>
                      <SelectItem value="Social Sciences" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Social Sciences</SelectItem>
                      <SelectItem value="Other" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Custom Department Input - Shows when "Other" is selected */}
                {formData.department === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customDepartment" className="text-sm font-medium text-gray-900 dark:text-gray-100">Specify Your Department *</Label>
                    <Input
                      id="customDepartment"
                      placeholder="Enter your department name"
                      value={formData.customDepartment || ""}
                      onChange={(e) => handleInputChange("customDepartment", e.target.value)}
                      className="h-12 border-2 border-blue-300 bg-white dark:bg-gray-800 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Please enter the full name of your department</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-sm font-medium text-gray-900 dark:text-gray-100">Academic Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                    <SelectTrigger className="h-12 border-2 border-blue-300 bg-white dark:bg-gray-800 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium">
                      <SelectValue placeholder="Choose your level" className="text-gray-900 dark:text-gray-100" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
                      <div className="px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30">
                        Undergraduate Levels
                      </div>
                      <SelectItem value="100" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-green-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">100 Level</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">First Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="200" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">200 Level</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Second Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="300" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">300 Level</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Third Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="400" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">400 Level</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Fourth Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="500" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-purple-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">500 Level</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Fifth Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <div className="px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Postgraduate Levels
                      </div>
                      <SelectItem value="masters" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-indigo-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">Masters Degree</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Postgraduate (MSc/MA)</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="phd" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-red-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">PhD/Doctorate</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Doctoral Studies</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Artisan-specific fields */}
          {formData.role === "artisan" && (
            <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Artisan Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Business/Workshop Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Fatima's Fashion House"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-medium text-gray-900 dark:text-gray-100">Specialization *</Label>
                  <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                    <SelectTrigger className="h-12 border-2 border-orange-300 bg-white dark:bg-gray-800 hover:border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium">
                      <SelectValue placeholder="Select your specialization" className="text-gray-900 dark:text-gray-100" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 shadow-xl">
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30">
                        Fashion & Textiles
                      </div>
                      <SelectItem value="Fashion Design" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Fashion Design</SelectItem>
                      <SelectItem value="Tailoring" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Tailoring & Alterations</SelectItem>
                      <SelectItem value="Embroidery" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Embroidery & Decoration</SelectItem>
                      <SelectItem value="Textile Design" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Textile Design</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Crafts & Arts
                      </div>
                      <SelectItem value="Jewelry Making" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Jewelry Making</SelectItem>
                      <SelectItem value="Pottery" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Pottery & Ceramics</SelectItem>
                      <SelectItem value="Woodworking" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Woodworking & Carpentry</SelectItem>
                      <SelectItem value="Leather Work" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Leather Work</SelectItem>
                      <SelectItem value="Beadwork" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Beadwork & Accessories</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Technology & Digital
                      </div>
                      <SelectItem value="Web Development" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Web Development</SelectItem>
                      <SelectItem value="Graphic Design" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Graphic Design</SelectItem>
                      <SelectItem value="Photography" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Photography</SelectItem>
                      <SelectItem value="Digital Marketing" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Digital Marketing</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Food & Culinary
                      </div>
                      <SelectItem value="Catering" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Catering & Event Planning</SelectItem>
                      <SelectItem value="Baking" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Baking & Pastry</SelectItem>
                      <SelectItem value="Traditional Cooking" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Traditional Cooking</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Services
                      </div>
                      <SelectItem value="Hair Styling" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Hair Styling & Beauty</SelectItem>
                      <SelectItem value="Makeup Artistry" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Makeup Artistry</SelectItem>
                      <SelectItem value="Event Planning" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Event Planning</SelectItem>
                      <SelectItem value="Other" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Other Specialization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Custom Specialization Input - Shows when "Other" is selected */}
                {formData.specialization === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customSpecialization" className="text-sm font-medium text-gray-900 dark:text-gray-100">Specify Your Specialization *</Label>
                    <Input
                      id="customSpecialization"
                      placeholder="Enter your specialization"
                      value={formData.customSpecialization || ""}
                      onChange={(e) => handleInputChange("customSpecialization", e.target.value)}
                      className="h-12 border-2 border-orange-300 bg-white dark:bg-gray-800 hover:border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Please describe your area of expertise</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-900 dark:text-gray-100">Years of Experience *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className="h-12 border-2 border-orange-300 bg-white dark:bg-gray-800 hover:border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium">
                      <SelectValue placeholder="Select experience level" className="text-gray-900 dark:text-gray-100" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 shadow-xl">
                      <SelectItem value="1" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-green-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">1 Year</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Beginner</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="2" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">2-3 Years</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Developing Skills</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="4" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">4-5 Years</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Intermediate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="6" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">6-10 Years</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Advanced</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="11" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-purple-500 rounded-full shadow-sm"></div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">10+ Years</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Expert/Master</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-900 dark:text-gray-100">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger className="h-12 border-2 border-orange-300 bg-white dark:bg-gray-800 hover:border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium">
                      <SelectValue placeholder="Select your location" className="text-gray-900 dark:text-gray-100" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 shadow-xl">
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30">
                        Ilorin Areas
                      </div>
                      <SelectItem value="Ilorin Central" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Ilorin Central</SelectItem>
                      <SelectItem value="Ilorin East" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Ilorin East</SelectItem>
                      <SelectItem value="Ilorin West" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Ilorin West</SelectItem>
                      <SelectItem value="Ilorin South" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Ilorin South</SelectItem>
                      <SelectItem value="University Area" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">University Area (UNILORIN)</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Kwara State
                      </div>
                      <SelectItem value="Offa" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Offa</SelectItem>
                      <SelectItem value="Omu-Aran" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Omu-Aran</SelectItem>
                      <SelectItem value="Lafiagi" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Lafiagi</SelectItem>
                      <SelectItem value="Patigi" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Patigi</SelectItem>
                      <SelectItem value="Kaiama" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Kaiama</SelectItem>
                      <SelectItem value="Other Kwara" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Other Areas in Kwara</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                        Online Services
                      </div>
                      <SelectItem value="Online Only" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Online Services Only</SelectItem>
                      <SelectItem value="Hybrid" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-3">Hybrid (Online + Physical)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
