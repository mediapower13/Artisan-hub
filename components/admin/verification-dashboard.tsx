"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  GraduationCap, 
  User, 
  AlertTriangle,
  Download,
  ExternalLink,
  Search,
  Filter
} from "lucide-react"
import type { VerificationRequest, AdminUser, PlatformStats } from "@/lib/types"

interface VerificationDashboardProps {
  admin: AdminUser
}

export function VerificationDashboard({ admin }: VerificationDashboardProps) {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRequests: VerificationRequest[] = [
        {
          id: "vr-1",
          providerId: "provider-1",
          providerName: "Adebayo Fashion Design",
          providerEmail: "adebayo.johnson@student.unilorin.edu.ng",
          studentId: "UNILORIN/2020/123456",
          department: "Fine Arts",
          status: "pending",
          submittedAt: new Date("2024-01-15T10:00:00Z"),
          reviewedAt: undefined,
          reviewedBy: undefined,
          businessName: "Adebayo Custom Tailoring",
          businessDescription: "Professional tailoring and fashion design services specializing in traditional and modern Nigerian attire.",
          evidenceFiles: [
            { url: "/mock-portfolio-1.jpg", type: "portfolio" },
            { url: "/mock-certificate-1.pdf", type: "certificate" },
            { url: "/mock-student-id.jpg", type: "student_id" }
          ],
          specializations: ["Fashion Design", "Tailoring", "Traditional Wear"],
          experienceYears: 3,
          adminNotes: undefined
        },
        {
          id: "vr-2",
          providerId: "provider-2",
          providerName: "Fatima Web Solutions",
          providerEmail: "fatima.abdul@student.unilorin.edu.ng",
          studentId: "UNILORIN/2021/234567",
          department: "Computer Science",
          status: "approved",
          submittedAt: new Date("2024-01-10T14:30:00Z"),
          reviewedAt: new Date("2024-01-12T09:15:00Z"),
          reviewedBy: "admin-1",
          businessName: "Fatima Digital Services",
          businessDescription: "Web development and digital marketing services for small businesses and startups.",
          evidenceFiles: [
            { url: "/mock-portfolio-2.jpg", type: "portfolio" },
            { url: "/mock-certificate-2.pdf", type: "certificate" }
          ],
          specializations: ["Web Development", "Digital Marketing", "UI/UX Design"],
          experienceYears: 2,
          adminNotes: "Excellent portfolio, verified student status. Approved for web development services."
        },
        {
          id: "vr-3",
          providerId: "provider-3",
          providerName: "Musa Auto Repair",
          providerEmail: "musa.ibrahim@student.unilorin.edu.ng",
          studentId: "UNILORIN/2019/345678",
          department: "Mechanical Engineering",
          status: "rejected",
          submittedAt: new Date("2024-01-08T16:45:00Z"),
          reviewedAt: new Date("2024-01-09T11:20:00Z"),
          reviewedBy: "admin-2",
          businessName: "Musa Motors",
          businessDescription: "Automotive repair and maintenance services.",
          evidenceFiles: [
            { url: "/mock-certificate-3.pdf", type: "certificate" }
          ],
          specializations: ["Auto Repair", "Engine Diagnostics"],
          experienceYears: 1,
          adminNotes: "Insufficient evidence provided. Missing portfolio examples and student ID verification. Please resubmit with additional documentation."
        }
      ]

      const mockStats: PlatformStats = {
        totalUsers: 1245,
        totalProviders: 89,
        totalStudents: 1156,
        pendingVerifications: 15,
        approvedProviders: 67,
        rejectedApplications: 7,
        totalSkills: 156,
        totalEnrollments: 334,
        monthlyGrowthRate: 12.5,
        averageRating: 4.3
      }

      setVerificationRequests(mockRequests)
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRequests = verificationRequests.filter(request => {
    const matchesFilter = filter === "all" || request.status === filter
    const matchesSearch = searchTerm === "" || 
      request.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleApprove = async (requestId: string) => {
    // Mock approval logic
    setVerificationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "approved", 
              reviewedAt: new Date(), 
              reviewedBy: admin.id,
              adminNotes: "Approved after verification review."
            }
          : req
      )
    )
    setSelectedRequest(null)
  }

  const handleReject = async (requestId: string, reason: string) => {
    // Mock rejection logic
    setVerificationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "rejected", 
              reviewedAt: new Date(), 
              reviewedBy: admin.id,
              adminNotes: reason
            }
          : req
      )
    )
    setSelectedRequest(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProviders}</div>
              <div className="text-xs text-green-600 flex items-center">
                ↗ +{stats.monthlyGrowthRate}% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</div>
              <div className="text-xs text-muted-foreground">Requiring review</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedProviders}</div>
              <div className="text-xs text-muted-foreground">Active on platform</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Platform Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="text-xs text-muted-foreground">Average provider rating</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verification Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, business, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No verification requests found matching your criteria.
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {request.providerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{request.providerName}</h4>
                      <p className="text-sm text-muted-foreground">{request.businessName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {request.studentId}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {request.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Verification Request Review</DialogTitle>
                        </DialogHeader>
                        
                        {selectedRequest && (
                          <VerificationRequestDetail 
                            request={selectedRequest}
                            onApprove={handleApprove}
                            onReject={handleReject}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface VerificationRequestDetailProps {
  request: VerificationRequest
  onApprove: (requestId: string) => void
  onReject: (requestId: string, reason: string) => void
}

function VerificationRequestDetail({ request, onApprove, onReject }: VerificationRequestDetailProps) {
  const [rejectReason, setRejectReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(request.id, rejectReason)
      setIsRejecting(false)
      setRejectReason("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Provider Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Provider Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">{request.providerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{request.providerEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Student ID</label>
              <p className="font-medium">{request.studentId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="font-medium">{request.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Experience</label>
              <p className="font-medium">{request.experienceYears} years</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Business Name</label>
              <p className="font-medium">{request.businessName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm">{request.businessDescription}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Specializations</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Evidence Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {request.evidenceFiles.map((file, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {file.type.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" title={`View ${file.type} file`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  {file.url.endsWith('.pdf') ? (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <div className="text-xs text-muted-foreground">Image Preview</div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <a href={file.url} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      {request.adminNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Admin Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{request.adminNotes}</p>
            {request.reviewedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Reviewed on {new Date(request.reviewedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {request.status === "pending" && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          {isRejecting ? (
            <div className="space-y-4 flex-1">
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Confirm Rejection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsRejecting(false)
                    setRejectReason("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(request.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setIsRejecting(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
