import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../services/authService";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nim: "",
    major: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        nim: formData.nim || null,
      };
      await registerUser(payload);
      navigate("/login");
    } catch (err) {
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-slate-50/50 font-sans'>
      {/* Kolom Kiri - Teks Hero */}
      <div className='hidden lg:flex w-1/2 bg-slate-50 flex-col justify-center items-center p-12'>
        <h1 className='text-5xl font-extrabold text-[#0a4b39] text-center mb-6 tracking-tight leading-tight'>
          INNOVATE. CREATE.
          <br />
          COLLABORATE.
        </h1>
        <p className='text-center text-slate-600 mb-12 max-w-md'>
          Join a premium professional ecosystem where student ambition meets
          industry excellence. Start your journey into the talent hub today.
        </p>
        <img
          src='/auth/auth.png'
          alt='Ilustrasi'
          className='w-72 h-96 object-contain'
        />
      </div>

      {/* Kolom Kanan - Form */}
      <div className='w-full lg:w-1/2 flex flex-col p-8 lg:p-16'>
        <div className='flex justify-between items-center mb-8 lg:mb-auto'>
          <span className='font-bold text-xl text-[#0a4b39]'>
            Student Talent Hub
          </span>
          <a
            href='#'
            className='text-sm text-slate-500 hover:text-[#0a4b39] font-medium'
          >
            Help
          </a>
        </div>

        <div className='max-w-md w-full mx-auto my-auto'>
          <div className='bg-white p-8 lg:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50'>
            {/* Tabs */}
            <div className='flex w-full border-b border-slate-200 mb-8'>
              <Link
                to='/login'
                className='w-1/2 pb-3 text-center text-slate-400 hover:text-slate-600 font-medium'
              >
                Login
              </Link>
              <div className='w-1/2 pb-3 text-center border-b-2 border-[#0a4b39] font-semibold text-[#0a4b39]'>
                Register
              </div>
            </div>

            <h2 className='text-2xl font-bold text-[#0a4b39] mb-2'>
              Create Account
            </h2>
            <p className='text-sm text-slate-500 mb-8'>
              Step into the future of professional collaboration.
            </p>

            {error && (
              <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className='space-y-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Akmal'
                  className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none'
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='akmal@student.unhas.ac.id'
                  className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none'
                  required
                />
              </div>

              {/* NIM & Major */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-slate-700'>
                    Student ID (NIM)
                  </label>
                  <input
                    type='text'
                    name='nim'
                    value={formData.nim}
                    onChange={handleChange}
                    placeholder='H071241065'
                    className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-slate-700'>
                    Major
                  </label>
                  <select
                    name='major'
                    value={formData.major}
                    onChange={handleChange}
                    className='w-full border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none bg-white'
                  >
                    <option value='' disabled>
                      Select Major
                    </option>
                    <option value='Sistem Informasi'>Sistem Informasi</option>
                    <option value='Teknik Informatika'>
                      Teknik Informatika
                    </option>
                    <option value='Ilmu Komputer'>Ilmu Komputer</option>
                  </select>
                </div>
              </div>

              {/* Role */}
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Role
                </label>
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  className='w-full border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none bg-white'
                >
                  <option value='student'>Student</option>
                  <option value='recruiter'>Recruiter</option>
                </select>
              </div>

              {/* Passwords */}
              <div className='space-y-1.5'>
                <label className='text-xs font-semibold text-slate-700'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Min. 8 characters'
                  className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none'
                  required
                />
              </div>

              <div className='space-y-1.5 pb-2'>
                <label className='text-xs font-semibold text-slate-700'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Re-enter password'
                  className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-2.5 outline-none'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full text-white bg-[#0a4b39] hover:bg-[#083a2c] focus:ring-4 focus:outline-none focus:ring-[#0a4b39]/30 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors shadow-md shadow-[#0a4b39]/20'
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className='mt-6 text-center'>
              <span className='text-sm text-slate-500'>
                Already have an account?{" "}
                <Link
                  to='/login'
                  className='font-bold text-[#0a4b39] hover:underline'
                >
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className='flex justify-between items-center mt-auto text-xs text-slate-400'>
          <span>&copy; 2026 Student Talent Hub.</span>
          <div className='space-x-4'>
            <a href='#' className='hover:text-slate-600'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-slate-600'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
