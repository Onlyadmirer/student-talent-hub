import RegisterForm from '../components/auth/RegisterForm.tsx'

export default function RegisterPage() {
  return (
    <div className="flex w-full min-h-screen max-md:flex-col">
      <div className="flex-1 bg-[linear-gradient(135deg,#f8fafb_0%,#eef2f3_100%)] flex flex-col items-center justify-center p-10 text-center">
        <div className="max-w-[480px] mb-10">
          <h1 className="font-heading text-[2.5rem] font-extrabold leading-tight text-primary mb-5">
            INNOVATE. CREATE.<br />COLLABORATE.
          </h1>
          <p className="text-[#4b5563] text-base leading-relaxed font-normal">
            Join a premium professional ecosystem where student ambition meets industry excellence. Start your journey into the talent hub today.
          </p>
        </div>
        <div className="w-full max-w-[380px]">
          <img src="/images/Colloborate.png" alt="Student Talent Hub Illustration" className="w-full h-auto shadow-[0_15px_35px_rgba(0,0,0,0.05)]" />
        </div>
      </div>
      <div className="flex-[1.1] flex flex-col p-10 max-md:p-5 bg-[#fafafa]">
        <RegisterForm />
      </div>
    </div>
  )
}
