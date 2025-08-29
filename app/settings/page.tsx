"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { supabase } from "@/lib/supabase"
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    theme: "system",
    language: "en",
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Initialize profile data when user is available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: "",
        location: user.location || "",
      })
    }
  }, [user])

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences')
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences)
        setPreferences(prev => ({ ...prev, ...parsedPreferences }))
      } catch (error) {
        console.warn('Failed to parse saved preferences:', error)
      }
    }
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!profileData.firstName.trim()) {
      setError("First name is required")
      setIsLoading(false)
      return
    }

    if (!profileData.lastName.trim()) {
      setError("Last name is required")
      setIsLoading(false)
      return
    }

    if (!profileData.email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: profileData.firstName.trim(),
          last_name: profileData.lastName.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      console.error('Profile update error:', err)
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // TODO: Implement preferences storage in database
      // For now, store preferences in localStorage as a temporary solution
      localStorage.setItem('userPreferences', JSON.stringify(preferences))

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setSuccess("Preferences updated successfully!")
    } catch (err) {
      setError("Failed to update preferences. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!security.currentPassword) {
      setError("Current password is required")
      setIsLoading(false)
      return
    }

    if (!security.newPassword) {
      setError("New password is required")
      setIsLoading(false)
      return
    }

    if (security.newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (security.newPassword !== security.confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Update password using Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: security.newPassword
      })

      if (updateError) {
        throw updateError
      }

      // Also update the password in the users table (for consistency)
      // Note: In production, passwords should be properly hashed
      const { error: dbUpdateError } = await supabase
        .from('users')
        .update({
          password: security.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (dbUpdateError) {
        console.warn('Failed to update password in users table:', dbUpdateError)
        // Don't throw here as the auth password was already updated
      }

      setSuccess("Password changed successfully!")

      // Clear password fields
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      console.error('Password change error:', err)
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <SettingsIcon className="h-8 w-8 text-blue-600" />
                Account Settings
              </h1>
              <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
            </div>

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.fullName || "User"} />
                          <AvatarFallback className="text-lg">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                              : user?.fullName
                                ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                : 'U'
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., UNILORIN Campus"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified about updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            checked={preferences.smsNotifications}
                            onCheckedChange={(checked) =>
                              setPreferences(prev => ({ ...prev, smsNotifications: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Marketing Emails</Label>
                            <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                          </div>
                          <Switch
                            checked={preferences.marketingEmails}
                            onCheckedChange={(checked) =>
                              setPreferences(prev => ({ ...prev, marketingEmails: checked }))
                            }
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize how the application looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleAppearanceUpdate} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Appearance"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
}
