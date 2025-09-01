"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  GraduationCap
} from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    studentId: user?.studentId || "",
    level: user?.level || ""
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        studentId: user.studentId || "",
        level: user.level || ""
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      console.log("Saving profile data:", formData)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: user?.department || "",
      studentId: user?.studentId || "",
      level: user?.level || ""
    })
    setIsEditing(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="text-center p-8 bg-white border shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Log In
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white border shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt={user?.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-2xl font-bold">
                      {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-white border-2 border-white shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {user?.fullName}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {user?.department && (
                    <div className="flex items-center justify-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white border shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your personal information and contact details
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="border-gray-300"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-gray-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.fullName || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Address
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.email || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+234 XXX XXX XXXX"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700 mb-2 block">
                        Department
                      </Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          placeholder="e.g., Computer Science"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.department || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="level" className="text-sm font-medium text-gray-700 mb-2 block">
                        Level
                      </Label>
                      {isEditing ? (
                        <Input
                          id="level"
                          value={formData.level}
                          onChange={(e) => handleInputChange("level", e.target.value)}
                          placeholder="e.g., 400"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.level || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="studentId" className="text-sm font-medium text-gray-700 mb-2 block">
                        Student ID
                      </Label>
                      {isEditing ? (
                        <Input
                          id="studentId"
                          value={formData.studentId}
                          onChange={(e) => handleInputChange("studentId", e.target.value)}
                          placeholder="e.g., UNILORIN/2021/12345"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{formData.studentId || "Not provided"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
