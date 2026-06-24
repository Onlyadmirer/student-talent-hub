import AuthLayout from '../components/layout/AuthLayout.tsx'
import RegisterForm from '../components/auth/RegisterForm.tsx'

export default function RegisterPage() {
  return (
    <AuthLayout
      heroTitle="INNOVATE. CREATE. COLLABORATE."
      heroSubtitle="Join a premium professional ecosystem where student ambition meets industry excellence. Start your journey into the talent hub today."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
