import React from "react";

export default function Profile() {
  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-10'>
      {/* Card 1: Profile Header */}
      <div className='bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8'>
        {/* Avatar with Camera Icon */}
        <div className='relative shrink-0'>
          <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200'>
            {/* Placeholder untuk foto profil */}
            <img
              src='https://ui-avatars.com/api/?name=Akmal&background=0a4b39&color=fff&size=256'
              alt='Profile'
              className='w-full h-full object-cover'
            />
          </div>
          <button className='absolute bottom-1 right-1 w-8 h-8 bg-[#0a4b39] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-[#083a2c] transition-colors shadow-sm'>
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
                d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
              ></path>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
              ></path>
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className='flex-1 text-center md:text-left mt-2'>
          <h1 className='text-3xl font-bold text-[#0a4b39]'>Akmal</h1>
          <p className='text-slate-500 font-medium mt-1'>Information Systems</p>

          <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600'>
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                ></path>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                ></path>
              </svg>
              Makassar, ID
            </span>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600'>
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 14l9-5-9-5-9 5 9 5z'
                ></path>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                ></path>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 14l9-5-9-5-9 5 9 5zm0 0v6'
                ></path>
              </svg>
              4th Semester Student
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <div className='mt-4 md:mt-0'>
          <button className='flex items-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm'>
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
                d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
              ></path>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Card 2: My Bio */}
      <div className='bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative'>
        <h2 className='text-xl font-bold text-[#0a4b39] mb-4'>My Bio</h2>
        <svg
          className='absolute top-8 right-8 w-8 h-8 text-slate-200'
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
        </svg>
        <p className='text-slate-500 leading-relaxed text-sm pr-10'>
          Passionate Information Systems student with a strong focus on
          full-stack web development and big data ecosystems. I thrive at the
          intersection of complex backend architecture and clean user interface
          design. Currently building performant systems using Next.js, React,
          and Go, while actively exploring data processing with Apache Hadoop
          and Spark. I am always emphasizing clean code, scalable solutions, and
          continuous learning.
        </p>
      </div>

      {/* Card 3: My Skills */}
      <div className='bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-[#0a4b39]'>My Skills</h2>
          <button className='text-sm font-semibold text-slate-500 hover:text-[#0a4b39] flex items-center gap-1 transition-colors'>
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
              ></path>
            </svg>
            Add Skill
          </button>
        </div>

        <div className='flex flex-wrap gap-3'>
          {/* Skill Chip (Expert) */}
          <div className='flex items-center gap-2 bg-teal-50 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border border-teal-100'>
            React
            <span className='bg-[#0a4b39] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide'>
              EXPERT
            </span>
          </div>

          {/* Skill Chip (Intermediate) */}
          <div className='flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200'>
            Next.js
            <span className='bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide'>
              INTERMEDIATE
            </span>
          </div>

          {/* Skill Chip (Expert) */}
          <div className='flex items-center gap-2 bg-teal-50 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border border-teal-100'>
            Tailwind CSS
            <span className='bg-[#0a4b39] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide'>
              EXPERT
            </span>
          </div>

          {/* Skill Chip (Intermediate) */}
          <div className='flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200'>
            Go (Golang)
            <span className='bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide'>
              INTERMEDIATE
            </span>
          </div>

          {/* Skill Chip (Intermediate) */}
          <div className='flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200'>
            System Architecture
            <span className='bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide'>
              INTERMEDIATE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
