import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, IdentificationCard, GraduationCap, LockKey, ShieldCheck, Eye, EyeSlash, Briefcase } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext.tsx'

export default function RegisterForm() {
  const [form, setForm] = useState({ fullname: '', nim: '', major: '', password: '', confirmPassword: '', role: 'student' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const isStudent = form.role === 'student'

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const data: Record<string, unknown> = {
        name: form.fullname,
        password: form.password,
        role: form.role,
      }
      if (isStudent) {
        data.email = form.nim ? `${form.nim}@student.edu` : ''
        data.nim = form.nim
        data.major = form.major
      } else {
        data.email = `${form.fullname.toLowerCase().replace(/\s+/g, '.')}@recruiter.com`
        data.major = null
      }
      await register(data)
      navigate('/login')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } }; message?: string }
      const detail = axiosErr?.response?.data?.detail || axiosErr?.message
      console.error('Register error:', err)
      setError(detail || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center w-full mb-auto">
        <span className="text-primary font-bold text-lg">Student Talent Hub</span>
        <a href="#" className="text-sm text-[#4b5563] font-medium no-underline hover:text-[#111]">Help</a>
      </div>

      <div className="flex items-center justify-center flex-1 w-full">
        <div className="bg-white w-full max-w-[460px] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-10 border border-[#f3f4f6]">
          <h2 className="text-[1.75rem] font-bold text-primary mb-2">Create Account</h2>
          <p className="text-sm text-[#4b5563] mb-8">Step into the future of professional collaboration.</p>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#374151] mb-2">I am a</label>
              <div className="flex bg-[#f3f4f6] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: 'student', nim: '', major: '' }))}
                  className={`flex-1 px-4 py-2.5 rounded-md text-[0.85rem] font-semibold cursor-pointer border-none transition-all flex items-center justify-center gap-2 ${
                    isStudent ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#555]'
                  }`}
                >
                  <IdentificationCard size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: 'recruiter' }))}
                  className={`flex-1 px-4 py-2.5 rounded-md text-[0.85rem] font-semibold cursor-pointer border-none transition-all flex items-center justify-center gap-2 ${
                    !isStudent ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#555]'
                  }`}
                >
                  <Briefcase size={18} /> Recruiter
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="fullname" className="block text-xs font-semibold text-[#374151] mb-2">Full Name</label>
              <div className="relative flex items-center">
                <User size={20} className="absolute left-[14px] text-[#9ca3af]" />
                <input id="fullname" type="text" placeholder="Enter your full name" value={form.fullname} onChange={update('fullname')}
                  className="w-full py-3 pl-[42px] pr-[14px] border border-[#e5e7eb] rounded-lg text-sm text-[#111] outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,77,64,0.1)] placeholder:text-[#6B7280]" required />
              </div>
            </div>

            {isStudent && (
              <div className="flex gap-4 mb-5 max-md:flex-col max-md:gap-0">
                <div className="flex-1">
                  <label htmlFor="nim" className="block text-xs font-semibold text-[#374151] mb-2">Student ID (NIM)</label>
                  <div className="relative flex items-center">
                    <IdentificationCard size={20} className="absolute left-[14px] text-[#9ca3af]" />
                    <input id="nim" type="text" placeholder="8-digit ID" value={form.nim} onChange={update('nim')}
                      className="w-full py-3 pl-[42px] pr-[14px] border border-[#e5e7eb] rounded-lg text-sm text-[#111] outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,77,64,0.1)] placeholder:text-[#6B7280]" required />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="major" className="block text-xs font-semibold text-[#374151] mb-2">Major</label>
                  <div className="relative flex items-center">
                    <GraduationCap size={20} className="absolute left-[14px] text-[#9ca3af] z-10" />
                    <select id="major" value={form.major} onChange={update('major')}
                      className="w-full py-3 pl-[42px] pr-[14px] border border-[#e5e7eb] rounded-lg text-sm text-[#111] outline-none appearance-none bg-white focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,77,64,0.1)]" required>
                      <option value="" disabled>Select Major</option>
                      <option value="Information Systems">Information Systems</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {!isStudent && (
              <div className="mb-5 p-4 bg-blue-50 rounded-lg text-[0.8rem] text-blue-700">
                You will receive a recruiter account with access to explore student portfolios and talent search.
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#374151] mb-2">Password</label>
              <div className="relative flex items-center">
                <LockKey size={20} className="absolute left-[14px] text-[#9ca3af]" />
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={update('password')}
                  className="w-full py-3 pl-[42px] pr-[42px] border border-[#e5e7eb] rounded-lg text-sm text-[#111] outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,77,64,0.1)] placeholder:text-[#6B7280]" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-[14px] text-[#9ca3af] cursor-pointer hover:text-[#4b5563] bg-transparent border-none p-0">
                  {showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="confirm_password" className="block text-xs font-semibold text-[#374151] mb-2">Confirm Password</label>
              <div className="relative flex items-center">
                <ShieldCheck size={20} className="absolute left-[14px] text-[#9ca3af]" />
                <input id="confirm_password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={update('confirmPassword')}
                  className="w-full py-3 pl-[42px] pr-[42px] border border-[#e5e7eb] rounded-lg text-sm text-[#111] outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,77,64,0.1)] placeholder:text-[#6B7280]" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-[14px] text-[#9ca3af] cursor-pointer hover:text-[#4b5563] bg-transparent border-none p-0">
                  {showConfirmPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full p-[14px] bg-primary text-white border-none rounded-lg text-sm font-semibold cursor-pointer mt-2.5 hover:bg-primary-dark transition-colors font-body">
              {isStudent ? 'Register as Student' : 'Register as Recruiter'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#4b5563]">
            Already have an account? <Link to="/login" className="text-[#111] font-bold no-underline hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center w-full mt-auto text-xs text-[#6b7280] font-medium max-md:flex-col max-md:gap-4 max-md:text-center">
        <span>© 2024 Student Talent Hub.</span>
        <div className="flex gap-5">
          <a href="#" className="text-[#6b7280] no-underline hover:text-[#111]">Privacy Policy</a>
          <a href="#" className="text-[#6b7280] no-underline hover:text-[#111]">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}
