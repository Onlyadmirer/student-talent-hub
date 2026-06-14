import React from "react";

export default function Dashboard() {
  // Mock Data sementara sebelum disambung ke API backend
  const summary = {
    projects: 8,
    skills: 12,
    endorsements: 5,
  };

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Greeting Section */}
      <div>
        <h1 className='text-3xl font-bold text-[#0a4b39] tracking-tight'>
          Welcome back, Akmal!
        </h1>
        <p className='text-slate-500 mt-2'>
          Here is what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Card 1 */}
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
              ></path>
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.projects} Projects
            </h3>
            <p className='text-xs font-semibold text-slate-500'>
              Active Engagements
            </p>
          </div>
        </div>

        {/* Card 2 */}
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
              ></path>
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.skills} Skills
            </h3>
            <p className='text-xs font-semibold text-slate-500'>
              Verified Competencies
            </p>
          </div>
        </div>

        {/* Card 3 */}
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
              ></path>
            </svg>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-[#0a4b39]'>
              {summary.endorsements} Endorsements
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
          <div className='bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4'>
            {/* Project Item 1 */}
            <div className='flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-12 bg-slate-200 rounded object-cover overflow-hidden'>
                  <img
                    src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=100&h=80'
                    alt='thumbnail'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-sm text-[#0a4b39]'>
                    Sustainable Urban Planning AI
                  </h4>
                  <p className='text-xs text-slate-500'>Updated 2 hours ago</p>
                </div>
              </div>
              <span className='px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full'>
                Published
              </span>
            </div>

            {/* Project Item 2 */}
            <div className='flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-t border-slate-100'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-12 bg-slate-200 rounded object-cover overflow-hidden'>
                  <img
                    src='https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=100&h=80'
                    alt='thumbnail'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-sm text-[#0a4b39]'>
                    Blockchain for Supply Transparency
                  </h4>
                  <p className='text-xs text-slate-500'>Updated yesterday</p>
                </div>
              </div>
              <span className='px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full'>
                Published
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Open for Collaboration */}
        <div className='space-y-4'>
          <h2 className='text-xl font-bold text-[#0a4b39] mb-4'>
            Open for Collaboration
          </h2>
          <div className='bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-5'>
            {/* Collab Item 1 */}
            <div className='border border-slate-100 rounded-lg p-4 relative shadow-sm'>
              <span className='px-2 py-1 bg-teal-100 text-teal-700 text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block'>
                Open
              </span>
              <button className='absolute top-4 right-4 text-slate-400 hover:text-slate-600'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'></path>
                </svg>
              </button>
              <h4 className='font-bold text-sm text-[#0a4b39] mb-1'>
                Eco-Friendly Packaging App
              </h4>
              <p className='text-xs text-slate-500 mb-3 leading-relaxed'>
                Seeking a UI Designer to help with the mobile onboarding flow.
              </p>
              <div className='flex -space-x-2'>
                <div className='w-6 h-6 rounded-full border-2 border-white bg-slate-300'></div>
                <div className='w-6 h-6 rounded-full border-2 border-white bg-slate-400'></div>
              </div>
            </div>

            {/* Collab Item 2 */}
            <div className='border border-slate-100 rounded-lg p-4 relative shadow-sm'>
              <span className='px-2 py-1 bg-teal-100 text-teal-700 text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block'>
                Open
              </span>
              <button className='absolute top-4 right-4 text-slate-400 hover:text-slate-600'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'></path>
                </svg>
              </button>
              <h4 className='font-bold text-sm text-[#0a4b39] mb-1'>
                FinTech Literacy for Teens
              </h4>
              <p className='text-xs text-slate-500 mb-3 leading-relaxed'>
                Looking for a Backend Developer with Python/Django experience.
              </p>
              <div className='flex -space-x-2'>
                <div className='w-6 h-6 rounded-full border-2 border-white bg-teal-400'></div>
              </div>
            </div>

            <button className='w-full text-center text-xs font-semibold text-[#0a4b39] hover:underline pt-2 border-t border-slate-100 mt-2'>
              Explore More Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
