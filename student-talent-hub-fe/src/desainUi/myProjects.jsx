import React from "react";

export default function MyProjects() {
  // Mockup data proyek (Nantinya di-fetch dari GET /projects/ dengan parameter current_user)
  const mockProjects = [
    {
      id: 1,
      title: "VELO E-Commerce Hub",
      description:
        "Platform e-commerce berkecepatan tinggi dengan fitur keranjang belanja real-time. Dibangun menggunakan Next.js dan Prisma dengan arsitektur backend Go (Golang).",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400",
      status: "Published",
      recruitment: "Open",
    },
    {
      id: 2,
      title: "IoT Fish Pond Feeder (PKM-PI)",
      description:
        "Sistem integrasi sensor dan pakan ikan otomatis berbasis Internet of Things untuk optimalisasi pembibitan kolam.",
      image:
        "https://images.unsplash.com/photo-1584473457409-ae5c91d765b1?auto=format&fit=crop&q=80&w=600&h=400",
      status: "Published",
      recruitment: "Open",
    },
    {
      id: 3,
      title: "Big Data Iris Analysis",
      description:
        "Analisis dan pemrosesan dataset Iris dalam skala besar memanfaatkan environment Apache Hadoop dan PySpark.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400",
      status: "Hidden",
      recruitment: "Closed",
    },
    {
      id: 4,
      title: "Student Talent Hub",
      description:
        "Platform jejaring untuk mahasiswa berkolaborasi lintas jurusan. Dilengkapi sistem autentikasi JWT dan database PostgreSQL.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=400",
      status: "Published",
      recruitment: "Open",
    },
    {
      id: 5,
      title: "Geospatial Data Merger",
      description:
        "Alat otomatisasi untuk menggabungkan layer vektor GIS menggunakan QGIS dan memvisualisasikan datanya.",
      image:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=400",
      status: "Published",
      recruitment: "Open",
    },
  ];

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
        <button className='flex items-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#0a4b39]/20'>
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
          Upload New Project
        </button>
      </div>

      {/* Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Render Project Cards */}
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className='bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow'
          >
            {/* Thumbnail */}
            <div className='h-48 w-full bg-slate-200 overflow-hidden'>
              <img
                src={project.image}
                alt={project.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            </div>

            {/* Content */}
            <div className='p-6 flex flex-col flex-1'>
              <h3 className='text-xl font-bold text-[#0a4b39] mb-3 line-clamp-2 leading-tight'>
                {project.title}
              </h3>
              <p className='text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed'>
                {project.description}
              </p>

              {/* Badges - Pushed to bottom */}
              <div className='mt-auto flex flex-wrap gap-2'>
                <span
                  className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                    project.status === "Published"
                      ? "bg-[#e6fcf5] text-[#0a4b39]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Status: {project.status}
                </span>

                <span
                  className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                    project.recruitment === "Open"
                      ? "bg-[#e6fcf5] text-[#0a4b39]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Recruitment: {project.recruitment}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Add New Card */}
        <div className='border-2 border-dashed border-slate-300 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-slate-400 hover:text-[#0a4b39] hover:border-[#0a4b39] hover:bg-slate-50 transition-all cursor-pointer group'>
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
              ></path>
            </svg>
          </div>
          <span className='font-semibold text-sm'>New Project</span>
        </div>
      </div>

      {/* Footer */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-12 text-[11px] text-slate-400 border-t border-slate-200 pt-6'>
        <span>
          © 2026 Student Talent Hub. Empowering the next generation of
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
