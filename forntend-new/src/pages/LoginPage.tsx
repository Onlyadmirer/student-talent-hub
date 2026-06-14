import AuthLayout from '../components/layout/AuthLayout.tsx'
import LoginForm from '../components/auth/LoginForm.tsx'

export default function LoginPage() {
  return (
    <AuthLayout
      heroTitle="INNOVATE. CREATE. COLLABORATE."
      heroSubtitle="Join the ecosystem where academic excellence meets professional opportunity. Student Talent Hub is your bridge to a future-ready career."
    >
      <LoginForm />
    </AuthLayout>
  )
}
