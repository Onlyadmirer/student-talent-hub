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
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
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
      <Route path="/recruiter/students/:id" element={<ProtectedRoute><StudentPortfolioRecruiterPage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
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
