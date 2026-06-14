import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-white font-sans'>
      {/* Kolom Kiri - Ilustrasi */}
      <div className='hidden lg:flex w-1/2 bg-slate-50 flex-col justify-center items-center p-12 relative'>
        <div className='absolute bottom-10 text-center'>
          <p className='text-sm text-slate-500'>
            &copy; 2026 Student Talent Hub. Empowering professionals.
          </p>
        </div>

        <h1 className='text-4xl font-extrabold text-[#0a4b39] text-center mb-4 tracking-tight'>
          INNOVATE. CREATE.
          <br />
          COLLABORATE.
        </h1>
        <p className='text-center text-slate-500 max-w-md'>
          Join the ecosystem where academic excellence meets professional
          opportunity. Student Talent Hub is your bridge to a future-ready
          career.
        </p>
        <img
          src='/auth/auth.png'
          alt='Ilustrasi'
          className='w-80 h-96 object-contain mb-8'
        />
      </div>

      {/* Kolom Kanan - Form */}
      <div className='w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative'>
        <div className='flex justify-between items-center mb-auto'>
          <span className='font-bold text-xl text-[#0a4b39]'>
            Student Talent Hub
          </span>
        </div>

        <div className='max-w-md w-full mx-auto my-auto'>
          <div className='bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
            {/* Tabs */}
            <div className='flex w-full border-b border-slate-200 mb-8'>
              <div className='w-1/2 pb-3 text-center border-b-2 border-[#0a4b39] font-semibold text-[#0a4b39]'>
                Login
              </div>
              <Link
                to='/register'
                className='w-1/2 pb-3 text-center text-slate-400 hover:text-slate-600 font-medium'
              >
                Register
              </Link>
            </div>

            {error && (
              <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className='space-y-5'>
              {/* Email Input */}
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Email Address
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='akmal@student.unhas.ac.id'
                    className='w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 outline-none transition-all'
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 outline-none transition-all'
                    required
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full text-white bg-[#0a4b39] hover:bg-[#083a2c] focus:ring-4 focus:outline-none focus:ring-[#0a4b39]/30 font-medium rounded-lg text-sm px-5 py-3.5 text-center transition-colors mt-4'
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>

          <div className='mt-8 text-center'>
            <a href='#' className='text-xs text-slate-500 hover:text-[#0a4b39]'>
              Need help with your account? Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
