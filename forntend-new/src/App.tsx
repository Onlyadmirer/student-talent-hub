import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import EditProfilePage from './pages/EditProfilePage.tsx'
import MyProjectsPage from './pages/MyProjectsPage.tsx'
import ProjectDetailPage from './pages/ProjectDetailPage.tsx'
import UploadProjectPage from './pages/UploadProjectPage.tsx'
import EditProjectPage from './pages/EditProjectPage.tsx'
import ExploreProjectsPage from './pages/ExploreProjectsPage.tsx'
import ProjectEndorsementsPage from './pages/ProjectEndorsementsPage.tsx'
import StudentProfilePage from './pages/StudentProfilePage.tsx'
import StudentPortfolioRecruiterPage from './pages/StudentPortfolioRecruiterPage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import MyRequestsPage from './pages/MyRequestsPage.tsx'
import AdminDashboardPage from './pages/AdminDashboardPage.tsx'
import AdminUsersPage from './pages/AdminUsersPage.tsx'
import AdminProjectsPage from './pages/AdminProjectsPage.tsx'
import AdminSkillsPage from './pages/AdminSkillsPage.tsx'
import RecruiterDashboardPage from './pages/RecruiterDashboardPage.tsx'
import RecruiterSavedPage from './pages/RecruiterSavedPage.tsx'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function RecruiterRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "recruiter") return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />
  return <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><MyProjectsPage /></ProtectedRoute>} />
      <Route path="/projects/new" element={<ProtectedRoute><UploadProjectPage /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
      <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><ExploreProjectsPage /></ProtectedRoute>} />
      <Route path="/projects/:id/endorsements" element={<ProtectedRoute><ProjectEndorsementsPage /></ProtectedRoute>} />
      <Route path="/students/:id" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
      <Route path="/recruiter/students/:id" element={<RecruiterRoute><StudentPortfolioRecruiterPage /></RecruiterRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/projects" element={<AdminRoute><AdminProjectsPage /></AdminRoute>} />
      <Route path="/admin/skills" element={<AdminRoute><AdminSkillsPage /></AdminRoute>} />
      <Route path="/recruiter/dashboard" element={<RecruiterRoute><RecruiterDashboardPage /></RecruiterRoute>} />
      <Route path="/recruiter/saved" element={<RecruiterRoute><RecruiterSavedPage /></RecruiterRoute>} />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
