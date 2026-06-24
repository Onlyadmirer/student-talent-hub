import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext.tsx";

export default function LoginForm() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    try {
      const userData = await login(nim, password);
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(detail || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <h2 className='font-heading text-[1.8rem] font-bold text-primary w-full max-w-[400px] text-left mb-10'>
        StudentIcon Talent Hub
      </h2>
      <div className='bg-white w-full max-w-[400px] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-10 pb-8 border border-card-border'>
        <div className='flex border-b border-[#e0e0e0] mb-8'>
          <Link
            to='/login'
            className='flex-1 text-center pb-4 text-sm font-semibold text-primary border-b-2 border-primary'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='flex-1 text-center pb-4 text-sm font-semibold text-[#888] no-underline'
          >
            Register
          </Link>
        </div>

        {error && <p className='text-red-600 text-sm mb-4'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='mb-5 text-left'>
            <label
              htmlFor='nim'
              className='block text-xs font-bold text-[#555] mb-2'
            >
              NIM / Email
            </label>
            <input
              id='nim'
              type='text'
              placeholder='Enter your NIM or email'
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className='w-full p-[14px_16px] border-none rounded-md bg-[#f3f4f6] text-sm text-[#333] outline-none focus:shadow-[0_0_0_2px_rgba(8,76,62,0.2)] placeholder:text-[#6B7280]'
              required
            />
          </div>
          <div className='mb-5 text-left'>
            <label
              htmlFor='password'
              className='block text-xs font-bold text-[#555] mb-2'
            >
              Password
            </label>
            <div className='relative flex items-center'>
              <input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-[14px_16px] border-none rounded-md bg-[#f3f4f6] text-sm text-[#333] outline-none focus:shadow-[0_0_0_2px_rgba(8,76,62,0.2)] placeholder:text-[#6B7280] pr-[42px]'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-[14px] text-[#9ca3af] cursor-pointer hover:text-[#4b5563] bg-transparent border-none p-0'
              >
                {showPassword ? <EyeIcon size={20} /> : <EyeSlashIcon size={20} />}
              </button>
            </div>
          </div>
          <button
            type='submit'
            className='w-full p-[14px] bg-primary text-white border-none rounded-md text-sm font-semibold cursor-pointer mt-2.5 hover:bg-primary-dark transition-colors'
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
