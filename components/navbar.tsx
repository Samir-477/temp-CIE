"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  LogOut,
  Menu,
  User,
  Mail,
  BadgeIcon as IdCard,
  Phone,
  MapPin,
  Calendar,
  Moon,
  Sun,
  Bell,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from 'next-themes'
import { NotificationDropdown } from "@/components/ui/notification-dropdown"
import { useNotifications } from "@/components/notification-provider"

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
}

// Profile data interfaces
interface BaseProfileData {
  name: string
  email: string
  id: string
  role: string
  phone: string | undefined
  join_date: string | Date
}

interface AdminProfileData extends BaseProfileData {
  role: "admin"
  department: string
  office: string
  permissions: string[]
  working_hours: string
}

interface FacultyProfileData extends BaseProfileData {
  role: "faculty"
  department: string
  office: string
  assigned_courses: string[]
  specialization: string
  office_hours: string
}

interface ProfessorProfileData extends BaseProfileData {
  role: "professor"
  department: string
  office: string
  assigned_courses: string[]
  specialization: string
  office_hours: string
}

interface StudentProfileData extends BaseProfileData {
  role: "student"
  student_id: string
  program: string
  year: string
  section: string
  gpa: string
  advisor: string
}

type ProfileData = AdminProfileData | FacultyProfileData | ProfessorProfileData | StudentProfileData

// Type guards
function isAdminProfile(data: ProfileData): data is AdminProfileData {
  return data.role === "admin"
}

function isFacultyProfile(data: ProfileData): data is FacultyProfileData {
  return data.role === "faculty"
}

function isProfessorProfile(data: ProfileData): data is ProfessorProfileData {
  return data.role === "professor"
}

function isStudentProfile(data: ProfileData): data is StudentProfileData {
  return data.role === "student"
}

export function Navbar({ sidebarOpen, setSidebarOpen, sidebarCollapsed }: NavbarProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { activities, unreadActivities, loading } = useNotifications()
  const [showProfileDetails, setShowProfileDetails] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "FACULTY":
        return "bg-blue-100 text-blue-800"
      case "PROFESSOR":
        return "bg-purple-100 text-purple-800"
      case "STUDENT":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const mockProfileData: ProfileData = {
    name: user?.name || "Unknown User",
    email: user?.email || "unknown@email.com",
    id: user?.id || "unknown",
    role: user?.role || "student",
    phone: "+91 9876543210",
    join_date: "2024-01-15",
    ...(user?.role === "ADMIN" && {
      department: "Administration",
      office: "Admin Block - Room 201",
      permissions: ["Manage Users", "System Settings", "Reports"],
      working_hours: "9 AM - 5 PM"
    }),
    ...(user?.role === "FACULTY" && {
      department: "Computer Science Engineering",
      office: "Engineering Block - Room 305",
      assigned_courses: ["Data Structures", "Algorithms", "Database Systems"],
      specialization: "Machine Learning & AI",
      office_hours: "Mon-Fri 2PM-4PM"
    }),
    ...(user?.role === "PROFESSOR" && {
      department: "Computer Science Engineering", 
      office: "Research Block - Room 401",
      assigned_courses: ["Advanced AI", "Research Methodology"],
      specialization: "Artificial Intelligence Research",
      office_hours: "Tue-Thu 10AM-12PM"
    }),
    ...(user?.role === "STUDENT" && {
      student_id: "PES1UG21CS123",
      program: "B.Tech Computer Science Engineering",
      year: "3rd Year",
      section: "A",
      gpa: "8.5",
      advisor: "Dr. John Smith"
    })
  } as const

  return (
    <div
      className={cn(
        "fixed top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 transition-all duration-300 dark:bg-gray-950",
        sidebarCollapsed ? "lg:left-16" : "lg:left-64",
        "left-0 right-0"
      )}
    >
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            CIE Dashboard
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <NotificationDropdown 
          activities={activities}
          unreadCount={unreadActivities.length}
          loading={loading}
        />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{mockProfileData.name}</p>
                  <Badge className={`text-xs ${getRoleColor(mockProfileData.role.toUpperCase())}`}>
                    {mockProfileData.role.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockProfileData.email}
                </p>
                <Button
                  variant="ghost"
                  className="h-6 justify-start p-0 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setShowProfileDetails(!showProfileDetails)}
                >
                  {showProfileDetails ? "Hide" : "Show"} Profile Details
                </Button>
              </div>
            </DropdownMenuLabel>
            
            {showProfileDetails && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <User className="mr-2 h-3 w-3" />
                    <span>ID: {mockProfileData.id}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Mail className="mr-2 h-3 w-3" />
                    <span>{mockProfileData.email}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="mr-2 h-3 w-3" />
                    <span>{mockProfileData.phone}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="mr-2 h-3 w-3" />
                    <span>Joined: {formatDate(mockProfileData.join_date)}</span>
                  </div>

                  {/* Role-specific details */}
                  {isAdminProfile(mockProfileData) && (
                    <>
                      <div className="flex items-center text-xs text-gray-600">
                        <IdCard className="mr-2 h-3 w-3" />
                        <span>{mockProfileData.department}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="mr-2 h-3 w-3" />
                        <span>{mockProfileData.office}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Working Hours:</span> {mockProfileData.working_hours}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Permissions:</span> {mockProfileData.permissions.join(", ")}
                      </div>
                    </>
                  )}

                  {(isFacultyProfile(mockProfileData) || isProfessorProfile(mockProfileData)) && (
                    <>
                      <div className="flex items-center text-xs text-gray-600">
                        <IdCard className="mr-2 h-3 w-3" />
                        <span>{mockProfileData.department}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="mr-2 h-3 w-3" />
                        <span>{mockProfileData.office}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Specialization:</span> {mockProfileData.specialization}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Office Hours:</span> {mockProfileData.office_hours}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Courses:</span> {mockProfileData.assigned_courses.join(", ")}
                      </div>
                    </>
                  )}

                  {isStudentProfile(mockProfileData) && (
                    <>
                      <div className="flex items-center text-xs text-gray-600">
                        <IdCard className="mr-2 h-3 w-3" />
                        <span>{mockProfileData.student_id}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Program:</span> {mockProfileData.program}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Year:</span> {mockProfileData.year}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Section:</span> {mockProfileData.section}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">GPA:</span> {mockProfileData.gpa}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Advisor:</span> {mockProfileData.advisor}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
