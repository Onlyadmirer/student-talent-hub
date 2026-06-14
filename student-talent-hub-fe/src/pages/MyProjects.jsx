import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";

export default function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.fetchWithAuth("/api/projects/me");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className='max-w-6xl mx-auto pb-12 font-sans'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-[#0a4b39] tracking-tight'>
            My Projects
          </h1>
          <p className='text-slate-500 text-sm mt-1'>
            Manage and showcase your professional portfolio
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")}
          className='flex items-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#0a4b39]/20'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 4v16m8-8H4'
            />
          </svg>
          Upload New Project
        </button>
      </div>

      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='w-8 h-8 border-4 border-[#0a4b39] border-t-transparent rounded-full animate-spin' />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className='bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow cursor-pointer'
            >
              {/* Thumbnail */}
              <div className='h-48 w-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-400'>
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <svg
                    className='w-12 h-12'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className='p-6 flex flex-col flex-1'>
                <h3 className='text-xl font-bold text-[#0a4b39] mb-3 line-clamp-2 leading-tight'>
                  {project.title}
                </h3>
                <p className='text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed'>
                  {project.description}
                </p>

                {/* Badges */}
                <div className='mt-auto flex flex-wrap gap-2'>
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                      project.status === "published"
                        ? "bg-[#e6fcf5] text-[#0a4b39]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {project.status}
                  </span>

                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                      project.is_open
                        ? "bg-[#e6fcf5] text-[#0a4b39]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {project.is_open ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* New Project Card */}
          <div
            onClick={() => navigate("/projects/new")}
            className='border-2 border-dashed border-slate-300 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-slate-400 hover:text-[#0a4b39] hover:border-[#0a4b39] hover:bg-slate-50 transition-all cursor-pointer group'>
            <div className='w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
              <svg
                className='w-8 h-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </div>
            <span className='font-semibold text-sm'>New Project</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-12 text-[11px] text-slate-400 border-t border-slate-200 pt-6'>
        <span>
          &copy; 2026 Student Talent Hub. Empowering the next generation of
          professionals.
        </span>
        <div className='flex gap-4 mt-2 sm:mt-0'>
          <a href='#' className='hover:text-slate-600'>
            Privacy Policy
          </a>
          <a href='#' className='hover:text-slate-600'>
            Terms of Service
          </a>
          <a href='#' className='hover:text-slate-600'>
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
}
