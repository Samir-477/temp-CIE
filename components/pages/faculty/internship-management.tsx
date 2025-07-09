"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Users,
  FileText,
  RefreshCw,
  Eye,
  User
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface InternshipProject {
  id: string
  title: string
  description: string
  duration: string
  skills: string
  facultyId: string
  slots: number | null
  startDate: string
  endDate: string
  isAccepted: boolean
  faculty?: {
    id: string
    name: string
  }
}

interface InternshipApplication {
  id: string
  internshipId: string
  studentId: string
  status: string
  applicationDate: string
  coverLetter?: string
  resume?: string
  student: {
    user: {
      name: string
      email: string
    }
    student_id: string
  }
}

export function InternshipManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [internships, setInternships] = useState<InternshipProject[]>([])
  const [applications, setApplications] = useState<{ [key: string]: InternshipApplication[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedInternship, setSelectedInternship] = useState<InternshipProject | null>(null)

  useEffect(() => {
    fetchInternships()
  }, [user])

  const fetchInternships = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/internships/available', {
        headers: { 'x-user-id': user.id }
      })
      const data = await response.json()
      
      // Filter internships assigned to this faculty
      const userInternships = (data.internships || []).filter((i: InternshipProject) => i.facultyId === user.id)
      setInternships(userInternships)
    } catch (error) {
      console.error("Error fetching internships:", error)
      toast({
        title: "Error",
        description: "Failed to load internships",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchApplicants = async (internshipId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/internships/${internshipId}/applicants`, {
        headers: { 'x-user-id': user.id }
      })
      const data = await response.json()
      setApplications(prev => ({ 
        ...prev, 
        [internshipId]: data.applications || [] 
      }))
    } catch (error) {
      console.error("Error fetching applicants:", error)
      toast({
        title: "Error",
        description: "Failed to load applicants",
        variant: "destructive",
      })
    }
  }

  const acceptProject = async (internshipId: string) => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/internships/${internshipId}/accept`, {
        method: 'POST',
        headers: { 'x-user-id': user.id },
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Project accepted successfully"
        })
        await fetchInternships()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to accept project')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string, internshipId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-user-id': user.id 
        },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Application ${status.toLowerCase()}`
        })
        await fetchApplicants(internshipId)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update application')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update application",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-3 w-3" />
      case "ACCEPTED":
        return <CheckCircle className="h-3 w-3" />
      case "REJECTED":
        return <XCircle className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const acceptedInternships = internships.filter(i => i.isAccepted)
  const pendingInternships = internships.filter(i => !i.isAccepted)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading internships...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Internship Management</h2>
          <p className="text-gray-600">Manage your assigned internship projects and applications</p>
        </div>
        <Button onClick={fetchInternships} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{internships.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{acceptedInternships.length}</p>
                <p className="text-sm text-gray-600">Accepted Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingInternships.length}</p>
                <p className="text-sm text-gray-600">Pending Acceptance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned Projects ({internships.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          <div className="grid gap-4">
            {internships.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No internships assigned</h3>
                  <p className="text-gray-600">You haven't been assigned any internship projects yet.</p>
                </CardContent>
              </Card>
            ) : (
              internships.map((internship) => (
                <Card key={internship.id} className={`hover:shadow-lg transition-shadow ${!internship.isAccepted ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-green-400'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{internship.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Duration: {internship.duration} | Slots: {internship.slots || 'Unlimited'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {internship.isAccepted ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepted
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <p className="text-sm text-gray-600 mt-1">{internship.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Required Skills</Label>
                        <p className="text-sm text-gray-600 mt-1">{internship.skills}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Timeline</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInternship(internship)
                          fetchApplicants(internship.id)
                        }}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        View Applications
                      </Button>
                      
                      {!internship.isAccepted && (
                        <Button 
                          size="sm"
                          onClick={() => acceptProject(internship.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept Project
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {selectedInternship ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Applications for: {selectedInternship.title}</h3>
                  <p className="text-gray-600">Review and manage student applications</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedInternship(null)}
                >
                  Back to Projects
                </Button>
              </div>

              <div className="grid gap-4">
                {applications[selectedInternship.id]?.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-gray-600">Students haven't applied for this internship yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  applications[selectedInternship.id]?.map((application) => (
                    <Card key={application.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {application.student.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{application.student.user.name}</h3>
                              <p className="text-sm text-gray-600">{application.student.user.email}</p>
                              <p className="text-sm text-gray-600">SRN: {application.student.student_id}</p>
                              <p className="text-xs text-gray-500">
                                Applied: {new Date(application.applicationDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span className="capitalize">{application.status.toLowerCase()}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>

                        {application.coverLetter && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <Label className="text-sm font-medium text-gray-700">Cover Letter</Label>
                            <p className="text-sm text-gray-600 mt-1">{application.coverLetter}</p>
                          </div>
                        )}

                        {application.status === "PENDING" && (
                          <div className="flex space-x-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => updateApplicationStatus(application.id, "REJECTED", selectedInternship.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateApplicationStatus(application.id, "ACCEPTED", selectedInternship.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a project</h3>
                <p className="text-gray-600">Choose a project from the "Assigned Projects" tab to view its applications.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}