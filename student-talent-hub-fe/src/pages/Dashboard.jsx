import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.fetchWithAuth("/api/users/me/dashboard-summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-[#0a4b39] border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className='text-center text-slate-500 py-12'>
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Greeting Section */}
      <div>
        <h1 className='text-3xl font-bold text-[#0a4b39] tracking-tight'>
          Welcome back!
        </h1>
        <p className='text-slate-500 mt-2'>
          Here is what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Projects Card */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-5'>
          <div className='w-14 h-14 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.total_projects} Projects
            </h3>
            <p className='text-xs font-semibold text-slate-500'>
              Active Engagements
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-5'>
          <div className='w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.total_skills} Skills
            </h3>
            <p className='text-xs font-semibold text-slate-500'>
              Verified Competencies
            </p>
          </div>
        </div>

        {/* Endorsements Card */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-5'>
          <div className='w-14 h-14 rounded-full bg-red-50 text-red-400 flex items-center justify-center'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.total_endorsements} Endorsements
            </h3>
            <p className='text-xs font-semibold text-slate-500'>From Mentors</p>
          </div>
        </div>
      </div>

      {/* Bottom Layout - 2 Columns */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Recent Projects */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex justify-between items-end mb-4'>
            <h2 className='text-xl font-bold text-[#0a4b39]'>
              Recent Projects
            </h2>
            <a
              href='#'
              className='text-sm font-semibold text-slate-500 hover:text-[#0a4b39]'
            >
              View All
            </a>
          </div>

          {summary.recent_projects.length === 0 ? (
            <div className='bg-white rounded-xl p-8 shadow-sm border border-slate-100 text-center text-slate-400 text-sm'>
              No projects yet. Create your first project to get started.
            </div>
          ) : (
            <div className='bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4'>
              {summary.recent_projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${
                    index > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-12 bg-slate-200 rounded object-cover overflow-hidden flex items-center justify-center text-slate-400 text-xs'>
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt='' />
                      ) : (
                        "No img"
                      )}
                    </div>
                    <div>
                      <h4 className='font-bold text-sm text-[#0a4b39]'>
                        {project.title}
                      </h4>
                      <p className='text-xs text-slate-500'>
                        {project.description?.slice(0, 60)}
                        {project.description?.length > 60 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                  <span className='px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full capitalize'>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Open for Collaboration */}
        <div className='space-y-4'>
          <h2 className='text-xl font-bold text-[#0a4b39] mb-4'>
            Open for Collaboration
          </h2>
          <div className='bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-5'>
            <div className='text-center text-slate-400 text-sm py-8'>
              Collaboration opportunities coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
