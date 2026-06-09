import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-white'>Welcome Back</h2>
          <p className='text-slate-400 mt-2'>Sign in to your account</p>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              placeholder='••••••••'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition-colors ${
              loading
                ? "bg-blue-600/50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-400'>
          Don't have an account?{" "}
          <Link
            to='/register'
            className='text-blue-400 hover:text-blue-300 font-medium'
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
