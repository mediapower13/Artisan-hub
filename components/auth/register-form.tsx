"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, GraduationCap, Wrench } from "lucide-react"
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
    if (!formData.firstName.trim()) return "First name is required"
    if (!formData.lastName.trim()) return "Last name is required"
    if (!formData.email.trim()) return "Email is required"
    if (!formData.phone.trim()) return "Phone number is required"
    if (!formData.password) return "Password is required"
    if (formData.password.length < 6) return "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) return "Passwords do not match"
    if (!formData.role) return "Please select your role"

    if (formData.role === "student") {
      if (!formData.studentId.trim()) return "Student ID is required"
      if (!formData.department) return "Department is required"
      if (formData.department === "Other" && !formData.customDepartment.trim()) return "Please specify your department"
      if (!formData.level) return "Academic level is required"
    }

    if (formData.role === "artisan") {
      if (!formData.businessName.trim()) return "Business/Workshop name is required"
      if (!formData.specialization) return "Specialization is required"
      if (formData.specialization === "Other" && !formData.customSpecialization.trim()) return "Please specify your specialization"
      if (!formData.experience) return "Experience level is required"
      if (!formData.location.trim()) return "Location is required"
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

  const getProgressStep = () => {
    if (!formData.role) return 1
    if (formData.role === "student" && !formData.department) return 2
    if (formData.role === "artisan" && !formData.specialization) return 2
    return 3
  }

  return (
    <div className="w-full space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Join the UNILORIN Artisan Community today
        </p>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className={`w-3 h-3 rounded-full ${getProgressStep() >= 2 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${getProgressStep() >= 3 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Step {getProgressStep()} of 3
          </span>
        </div>
      </div>
        
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Personal Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Let's start with your basic details
            </p>
          </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-900 dark:text-gray-100">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full h-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full h-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@unilorin.edu.ng"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full h-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full h-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full h-12 pr-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-r-lg transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-700 dark:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full h-12 pr-12 border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-200"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-r-lg transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-700 dark:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Role
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you here to learn or teach?
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-900 dark:text-gray-100">I am a *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "student" | "artisan") => handleInputChange("role", value)}
                >
                  <SelectTrigger className="w-full h-14 border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-all duration-200">
                    <SelectValue placeholder="Select your role" className="text-gray-900 dark:text-gray-100" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg">
                    <SelectItem value="student" className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 py-4 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Student</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">I want to learn new skills and connect with artisans</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="artisan" className="hover:bg-orange-50 dark:hover:bg-orange-900/50 text-gray-900 dark:text-gray-100 py-4 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Artisan</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">I want to teach my skills and grow my business</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Student-specific fields */}
            {formData.role === "student" && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Student Information
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Tell us about your academic details
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Student ID *</Label>
                      <Input
                        id="studentId"
                        placeholder="e.g., 19/55HA001"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                        className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                        <SelectTrigger className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-all duration-200 bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select your department" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 shadow-2xl rounded-lg">
                          <SelectItem value="Computer Science" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Computer Science</SelectItem>
                          <SelectItem value="Electrical Engineering" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Mechanical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Civil Engineering</SelectItem>
                          <SelectItem value="Chemical Engineering" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Chemical Engineering</SelectItem>
                          <SelectItem value="Business Administration" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Business Administration</SelectItem>
                          <SelectItem value="Economics" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Economics</SelectItem>
                          <SelectItem value="Accounting" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Accounting</SelectItem>
                          <SelectItem value="Mass Communication" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Mass Communication</SelectItem>
                          <SelectItem value="English Language" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">English Language</SelectItem>
                          <SelectItem value="Mathematics" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Mathematics</SelectItem>
                          <SelectItem value="Physics" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Physics</SelectItem>
                          <SelectItem value="Chemistry" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Chemistry</SelectItem>
                          <SelectItem value="Biology" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Biology</SelectItem>
                          <SelectItem value="Medicine" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Medicine</SelectItem>
                          <SelectItem value="Law" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Law</SelectItem>
                          <SelectItem value="Agriculture" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Agriculture</SelectItem>
                          <SelectItem value="Veterinary Medicine" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Veterinary Medicine</SelectItem>
                          <SelectItem value="Pharmacy" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Pharmacy</SelectItem>
                          <SelectItem value="Education" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Education</SelectItem>
                          <SelectItem value="Arts" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Arts</SelectItem>
                          <SelectItem value="Social Sciences" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Social Sciences</SelectItem>
                          <SelectItem value="Other" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.department === "Other" && (
                      <div className="space-y-2">
                        <Label htmlFor="customDepartment" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Specify Your Department *</Label>
                        <Input
                          id="customDepartment"
                          placeholder="Enter your department name"
                          value={formData.customDepartment || ""}
                          onChange={(e) => handleInputChange("customDepartment", e.target.value)}
                          className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          required
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Academic Level *</Label>
                      <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                        <SelectTrigger className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium rounded-lg bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Choose your level" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 shadow-2xl">
                          <div className="px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30">
                            Undergraduate
                          </div>
                          <SelectItem value="100" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">100 Level - First Year</SelectItem>
                          <SelectItem value="200" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">200 Level - Second Year</SelectItem>
                          <SelectItem value="300" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">300 Level - Third Year</SelectItem>
                          <SelectItem value="400" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">400 Level - Fourth Year</SelectItem>
                          <SelectItem value="500" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">500 Level - Fifth Year</SelectItem>
                          <div className="px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                            Postgraduate
                          </div>
                          <SelectItem value="masters" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">Masters Degree</SelectItem>
                          <SelectItem value="phd" className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/50">PhD/Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Artisan-specific fields */}
            {formData.role === "artisan" && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                    Artisan Information
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Tell us about your craft and business
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 rounded-xl border border-orange-200 dark:border-orange-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Business/Workshop Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="e.g., Fatima's Fashion House"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., UNILORIN Campus, Ilorin"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Specialization *</Label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                        <SelectTrigger className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium rounded-lg bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select your specialization" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 shadow-2xl">
                          <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30">
                            Fashion & Textiles
                          </div>
                          <SelectItem value="Fashion Design" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Fashion Design</SelectItem>
                          <SelectItem value="Tailoring" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Tailoring & Alterations</SelectItem>
                          <SelectItem value="Embroidery" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Embroidery & Decoration</SelectItem>
                          <SelectItem value="Textile Design" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Textile Design</SelectItem>
                          
                          <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                            Crafts & Arts
                          </div>
                          <SelectItem value="Jewelry Making" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Jewelry Making</SelectItem>
                          <SelectItem value="Pottery" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Pottery & Ceramics</SelectItem>
                          <SelectItem value="Woodworking" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Woodworking & Carpentry</SelectItem>
                          <SelectItem value="Leather Work" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Leather Work</SelectItem>
                          <SelectItem value="Beadwork" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Beadwork & Accessories</SelectItem>
                          
                          <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                            Technology & Digital
                          </div>
                          <SelectItem value="Web Development" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Web Development</SelectItem>
                          <SelectItem value="Graphic Design" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Graphic Design</SelectItem>
                          <SelectItem value="Photography" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Photography</SelectItem>
                          <SelectItem value="Digital Marketing" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Digital Marketing</SelectItem>
                          
                          <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                            Food & Culinary
                          </div>
                          <SelectItem value="Catering" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Catering & Event Planning</SelectItem>
                          <SelectItem value="Baking" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Baking & Pastry</SelectItem>
                          <SelectItem value="Traditional Cooking" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Traditional Cooking</SelectItem>
                          
                          <div className="px-3 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/30 border-t border-gray-200 dark:border-gray-600 mt-1">
                            Services
                          </div>
                          <SelectItem value="Hair Styling" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Hair Styling & Beauty</SelectItem>
                          <SelectItem value="Makeup Artistry" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Makeup Artistry</SelectItem>
                          <SelectItem value="Event Planning" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Event Planning</SelectItem>
                          <SelectItem value="Other" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">Other Specialization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.specialization === "Other" && (
                      <div className="space-y-2">
                        <Label htmlFor="customSpecialization" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Specify Your Specialization *</Label>
                        <Input
                          id="customSpecialization"
                          placeholder="Enter your specialization"
                          value={formData.customSpecialization || ""}
                          onChange={(e) => handleInputChange("customSpecialization", e.target.value)}
                          className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Years of Experience *</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium rounded-lg bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select experience level" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 shadow-2xl">
                          <SelectItem value="1" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">1 Year - Beginner</SelectItem>
                          <SelectItem value="2" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">2-3 Years - Developing Skills</SelectItem>
                          <SelectItem value="4" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">4-5 Years - Intermediate</SelectItem>
                          <SelectItem value="6" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">6-10 Years - Advanced</SelectItem>
                          <SelectItem value="11" className="text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/50">11+ Years - Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
        {/* Submit Button and Footer */}
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="submit" 
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
