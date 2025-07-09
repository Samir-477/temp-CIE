"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { FacultyDashboard } from "@/components/dashboards/faculty-dashboard"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { useEffect, useState } from "react"
import { useTheme } from 'next-themes';

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Add debug logging
  useEffect(() => {
    console.log("HomePage render - User:", user, "IsLoading:", isLoading, "Mounted:", mounted)
  }, [user, isLoading, mounted])

  if (!mounted || !resolvedTheme) {
    return null;
  }
  if (isLoading) {
    const isDark = resolvedTheme === 'dark';
    const logoSrc = isDark ? '/logo_cie_animation_black.gif' : '/logo_cie_animation_white.gif';
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-black' : 'bg-background'}`}>
        <img src={logoSrc} alt="CIE Loading" className="h-64 w-64 object-contain" />
      </div>
    );
  }

  if (!user) {
    console.log("Rendering LoginForm - no user found")
    return <LoginForm />
  }

  console.log("Rendering dashboard for user role:", user.role)

  // Render appropriate dashboard based on user role
  switch (user.role.toLowerCase()) {
    case "admin":
      return <AdminDashboard />
    case "faculty":
      return <FacultyDashboard />
    case "student":
      return <StudentDashboard />
    default:
      console.log("Unknown role, rendering LoginForm. Role:", user.role)
      return <LoginForm />
  }
}
