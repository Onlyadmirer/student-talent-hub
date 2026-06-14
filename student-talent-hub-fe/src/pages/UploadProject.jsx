import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";

export default function UploadProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_link: "",
    figma_link: "",
    is_open: true,
    visibility: "Published",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_open") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    console.log("File upload area clicked");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        github_link: formData.github_link || null,
        figma_link: formData.figma_link || null,
        is_open: formData.is_open,
      };

      const res = await api.fetchWithAuth("/api/projects/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to create project");
      }

      navigate("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto pb-12 font-sans'>
      {/* Back Link */}
      <Link
        to='/projects'
        className='inline-flex items-center gap-2 text-sm font-bold text-[#0a4b39] hover:text-[#083a2c] transition-colors mb-6'
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
          />
        </svg>
        Back to My Projects
      </Link>

      {/* Header */}
      <div className='mb-10'>
        <h1 className='text-4xl font-bold text-[#0a4b39] tracking-tight mb-2'>
          Upload New Project
        </h1>
        <p className='text-slate-500 text-sm'>
          Share your academic and professional milestones with the global
          student community.
        </p>
      </div>

      {error && (
        <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          {/* Kolom Kiri: Input Teks */}
          <div className='space-y-6'>
            {/* Project Title */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Project Title
              </label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='Enter a descriptive title'
                className='w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 outline-none transition-all shadow-sm'
                required
              />
            </div>

            {/* Project Description */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Project Description
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Tell us about your project, the challenges you faced, and the results...'
                rows='6'
                className='w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 outline-none transition-all resize-none shadow-sm'
                required
              />
            </div>

            {/* Github Link */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Github Repository Link
              </label>
              <input
                type='url'
                name='github_link'
                value={formData.github_link}
                onChange={handleChange}
                placeholder='https://github.com/username/repo'
                className='w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 outline-none transition-all shadow-sm'
              />
            </div>

            {/* Figma Link */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Figma Design Link
              </label>
              <input
                type='url'
                name='figma_link'
                value={formData.figma_link}
                onChange={handleChange}
                placeholder='https://figma.com/file/...'
                className='w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 outline-none transition-all shadow-sm'
              />
            </div>
          </div>

          {/* Kolom Kanan: Upload & Settings */}
          <div className='space-y-6'>
            {/* Thumbnail Upload */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Project Thumbnail
              </label>
              <div
                onClick={handleFileUpload}
                className='border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:bg-slate-50 flex flex-col items-center justify-center p-12 cursor-pointer transition-colors shadow-sm'
              >
                <div className='w-14 h-14 bg-[#f0f9f6] text-[#0a4b39] rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-bold text-[#0a4b39] mb-1'>
                  Upload File
                </h3>
                <p className='text-xs text-slate-500 text-center'>
                  Drag & drop or click to browse
                  <br />
                  (Recommended: 1200x630px, Max 5MB)
                </p>
              </div>
            </div>

            {/* Recruitment Status */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Recruitment Status
              </label>
              <div className='relative'>
                <select
                  name='is_open'
                  value={formData.is_open}
                  onChange={handleChange}
                  className='w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 pr-10 outline-none transition-all shadow-sm cursor-pointer'
                >
                  <option value={true}>Open for Collaboration</option>
                  <option value={false}>Closed</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400'>
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
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-600 tracking-wide'>
                Visibility
              </label>
              <div className='relative'>
                <select
                  name='visibility'
                  value={formData.visibility}
                  onChange={handleChange}
                  className='w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3.5 pr-10 outline-none transition-all shadow-sm cursor-pointer'
                >
                  <option value='Published'>Published</option>
                  <option value='Draft'>Draft</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400'>
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
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pro Tip Banner */}
            <div className='bg-[#e6fcf5] border border-[#c3f4e3] rounded-xl p-5 flex items-start gap-3 mt-2'>
              <svg
                className='w-5 h-5 text-[#0a4b39] shrink-0 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <div>
                <h4 className='text-sm font-bold text-[#0a4b39] mb-1'>
                  Pro Tip
                </h4>
                <p className='text-xs font-semibold text-[#0a4b39]/80 leading-relaxed'>
                  Adding clear documentation and design links increases project
                  visibility by up to 40% among recruiters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className='flex justify-end mt-10'>
          <button
            type='submit'
            disabled={saving}
            className='flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-[#0a4b39] hover:bg-[#083a2c] shadow-lg shadow-[#0a4b39]/30 transition-all hover:-translate-y-0.5 disabled:opacity-50'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
              />
            </svg>
            {saving ? "Saving..." : "Publish Project"}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-16 text-[11px] text-slate-400 border-t border-slate-200 pt-6'>
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
