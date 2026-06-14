import React from "react";
import { Link, useParams } from "react-router-dom";

export default function ProjectDetail() {
  // Dalam implementasi asli, gunakan const { id } = useParams()
  // lalu fetch data dari API: GET /projects/{id}

  const mockProject = {
    title: "VELO E-Commerce Hub",
    author: {
      name: "Akmal",
      avatar:
        "https://ui-avatars.com/api/?name=Akmal&background=0a4b39&color=fff",
    },
    status: "Published",
    recruitment: "Open",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=500",
    description: `VELO E-Commerce Hub is a high-performance, scalable online shopping platform designed to handle real-time inventory management and seamless checkout flows. Built with a focus on speed and reliability, the system leverages a robust architecture to ensure minimal latency during peak traffic.

The platform integrates advanced shopping cart logic, secure user authentication, and an intuitive dashboard for monitoring sales metrics. By utilizing modern web technologies, VELO aims to bridge the gap between complex backend operations and a flawless, glassmorphic user interface.`,
    tags: ["Next.js", "Go (Golang)", "Prisma", "TypeScript"],
    links: {
      github: "https://github.com/akmal/velo",
      figma: "https://figma.com/file/...",
    },
    team: [
      {
        id: 1,
        name: "Akmal",
        role: "Full-Stack Developer",
        avatar:
          "https://ui-avatars.com/api/?name=Akmal&background=0a4b39&color=fff",
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "UI/UX Designer",
        avatar:
          "https://ui-avatars.com/api/?name=Jane&background=f1f5f9&color=64748b",
      },
    ],
    endorsements: [
      {
        id: 1,
        author: "Dr. Sarah Jenkins",
        roleBadge: "PROFESSOR",
        roleColor: "bg-orange-100 text-orange-700",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah&background=f1f5f9&color=64748b",
        feedback:
          '"An exceptional demonstration of technical proficiency and system architecture. The integration of the backend routing was handled with impressive precision for a student project."',
      },
      {
        id: 2,
        author: "Marcus Thorne",
        roleBadge: "RECRUITER @ TECHFLOW",
        roleColor: "bg-teal-100 text-teal-700",
        avatar:
          "https://ui-avatars.com/api/?name=Marcus&background=f1f5f9&color=64748b",
        feedback:
          '"The attention to detail in the database schema design is remarkable. This project clearly showcases their ability to translate complex logic into a seamless digital experience."',
      },
    ],
  };

  return (
    <div className='max-w-5xl mx-auto pb-16 font-sans'>
      {/* Back Link */}
      <Link
        to='/projects'
        className='inline-flex items-center gap-2 text-sm font-bold text-[#0a4b39] hover:text-[#083a2c] transition-colors mb-8'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          ></path>
        </svg>
        Back to My Projects
      </Link>

      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
        <div>
          <h1 className='text-4xl font-extrabold text-[#0a4b39] tracking-tight mb-4'>
            {mockProject.title}
          </h1>
          <div className='flex flex-wrap items-center gap-4'>
            {/* Author Info */}
            <div className='flex items-center gap-2 pr-4 border-r border-slate-200'>
              <img
                src={mockProject.author.avatar}
                alt='Author'
                className='w-6 h-6 rounded-full'
              />
              <span className='text-sm font-medium text-slate-600'>
                By {mockProject.author.name}
              </span>
            </div>
            {/* Badges */}
            <span className='px-3 py-1 text-[10px] font-bold rounded-full bg-[#e6fcf5] text-[#0a4b39] uppercase tracking-wider'>
              Status: {mockProject.status}
            </span>
            <span className='px-3 py-1 text-[10px] font-bold rounded-full bg-[#e6fcf5] text-[#0a4b39] uppercase tracking-wider'>
              Recruitment: {mockProject.recruitment}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className='flex items-center justify-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0'>
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
          Edit Project
        </button>
      </div>

      {/* Hero Image */}
      <div className='w-full h-[400px] bg-slate-200 rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-100'>
        <img
          src={mockProject.image}
          alt='Project Cover'
          className='w-full h-full object-cover'
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
        {/* Left Column: About Project */}
        <div className='lg:col-span-2 bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
          <h2 className='text-xl font-bold text-[#0a4b39] mb-6'>
            About Project
          </h2>
          <div className='text-slate-600 text-sm leading-loose whitespace-pre-line mb-8'>
            {mockProject.description}
          </div>

          <div className='flex flex-wrap gap-2 pt-6 border-t border-slate-100'>
            {mockProject.tags.map((tag, idx) => (
              <span
                key={idx}
                className='px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-[#0a4b39]'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Links & Team */}
        <div className='space-y-6'>
          {/* Project Links */}
          <div className='bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
            <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-4'>
              Project Links
            </h3>
            <div className='space-y-3'>
              <a
                href={mockProject.links.github}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-[#0a4b39] hover:bg-slate-50 transition-colors group'
              >
                <span className='text-sm font-semibold text-[#0a4b39]'>
                  View GitHub
                  <br />
                  <span className='text-xs text-slate-500 font-normal'>
                    Repository
                  </span>
                </span>
                <svg
                  className='w-5 h-5 text-slate-400 group-hover:text-[#0a4b39]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  ></path>
                </svg>
              </a>
              <a
                href={mockProject.links.figma}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-[#0a4b39] hover:bg-slate-50 transition-colors group'
              >
                <span className='text-sm font-semibold text-[#0a4b39]'>
                  View Figma Design
                </span>
                <svg
                  className='w-5 h-5 text-slate-400 group-hover:text-[#0a4b39]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Project Team */}
          <div className='bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
            <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-5'>
              Project Team
            </h3>
            <div className='space-y-5'>
              {mockProject.team.map((member) => (
                <div key={member.id} className='flex items-center gap-3'>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className='w-10 h-10 rounded-full border border-slate-200'
                  />
                  <div>
                    <h4 className='text-sm font-bold text-[#0a4b39]'>
                      {member.name}
                    </h4>
                    <p className='text-xs text-slate-500'>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Endorsements Section */}
      <div>
        <h2 className='text-xl font-bold text-[#0a4b39] mb-6'>
          Project Endorsements & Feedback
        </h2>
        <div className='space-y-4'>
          {mockProject.endorsements.map((item) => (
            <div
              key={item.id}
              className='bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-6 items-start'
            >
              <img
                src={item.avatar}
                alt={item.author}
                className='w-12 h-12 rounded-full border border-slate-200 shrink-0'
              />
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-3'>
                  <h4 className='text-sm font-bold text-[#0a4b39]'>
                    {item.author}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded ${item.roleColor}`}
                  >
                    {item.roleBadge}
                  </span>
                </div>
                <p className='text-slate-600 text-sm italic leading-relaxed'>
                  {item.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
