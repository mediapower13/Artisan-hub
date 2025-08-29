"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Trash2,
  Save,
  Camera,
  Code,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    studentId: user?.studentId || ""
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    skillUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: "",
    webhookUrl: "",
    enableWebhooks: false,
    enableApiAccess: true,
    rateLimit: 1000
  })

  const [showApiKey, setShowApiKey] = useState(false)

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrivacyUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Privacy Updated",
        description: "Your privacy settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiSettingsUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "API Settings Updated",
        description: "Your API settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = () => {
    const newApiKey = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiSettings(prev => ({ ...prev, apiKey: newApiKey }))
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated.",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access your settings.
            </p>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={"/default-avatar.png"} />
                      <AvatarFallback>
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    {user?.role === 'student' && (
                      <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={profileData.studentId}
                          onChange={(e) => setProfileData(prev => ({ ...prev, studentId: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <Button onClick={handleProfileUpdate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="skill-updates">Skill Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about skill progress and deadlines
                        </p>
                      </div>
                      <Switch
                        id="skill-updates"
                        checked={notifications.skillUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, skillUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive promotional emails and newsletters
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="security-alerts">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Important security notifications
                        </p>
                      </div>
                      <Switch
                        id="security-alerts"
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleNotificationUpdate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-visibility">Profile Visibility</Label>
                      <select
                        id="profile-visibility"
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        aria-label="Profile visibility setting"
                      >
                        <option value="public">Public - Visible to everyone</option>
                        <option value="students">Students Only - Visible to students</option>
                        <option value="private">Private - Only you can see</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-email">Show Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your email on your public profile
                        </p>
                      </div>
                      <Switch
                        id="show-email"
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, showEmail: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-phone">Show Phone</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your phone number on your public profile
                        </p>
                      </div>
                      <Switch
                        id="show-phone"
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, showPhone: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow-messages">Allow Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow other users to send you messages
                        </p>
                      </div>
                      <Switch
                        id="allow-messages"
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handlePrivacyUpdate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Settings Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your API keys and integration settings
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* API Key Section */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your personal API key for accessing platform APIs
                      </p>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            id="api-key"
                            type={showApiKey ? "text" : "password"}
                            value={apiSettings.apiKey}
                            onChange={(e) => setApiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                            placeholder="Generate an API key to get started"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button onClick={generateApiKey} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        URL to receive webhook notifications for events
                      </p>
                      <Input
                        id="webhook-url"
                        type="url"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://your-app.com/webhook"
                      />
                    </div>

                    {/* API Access Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-api-access">Enable API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow API access using your API key
                        </p>
                      </div>
                      <Switch
                        id="enable-api-access"
                        checked={apiSettings.enableApiAccess}
                        onCheckedChange={(checked) =>
                          setApiSettings(prev => ({ ...prev, enableApiAccess: checked }))
                        }
                      />
                    </div>

                    {/* Webhooks Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-webhooks">Enable Webhooks</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive webhook notifications for important events
                        </p>
                      </div>
                      <Switch
                        id="enable-webhooks"
                        checked={apiSettings.enableWebhooks}
                        onCheckedChange={(checked) =>
                          setApiSettings(prev => ({ ...prev, enableWebhooks: checked }))
                        }
                      />
                    </div>

                    {/* Rate Limit */}
                    <div>
                      <Label htmlFor="rate-limit">Rate Limit (requests per hour)</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Maximum number of API requests allowed per hour
                      </p>
                      <select
                        id="rate-limit"
                        value={apiSettings.rateLimit}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        aria-label="API rate limit setting"
                      >
                        <option value={100}>100 requests/hour</option>
                        <option value={500}>500 requests/hour</option>
                        <option value={1000}>1000 requests/hour</option>
                        <option value={5000}>5000 requests/hour</option>
                        <option value={10000}>10000 requests/hour</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={handleApiSettingsUpdate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save API Settings"}
                  </Button>
                </CardContent>
              </Card>

              {/* API Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Learn how to use our APIs to integrate with your applications.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Authentication</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          How to authenticate API requests using your API key.
                        </p>
                        <Button variant="outline" size="sm">
                          View Docs
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Webhooks</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Set up webhooks to receive real-time notifications.
                        </p>
                        <Button variant="outline" size="sm">
                          View Docs
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred theme
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
