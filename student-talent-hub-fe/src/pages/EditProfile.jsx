import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import AddSkillModal from "../components/AddSkillModal";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    nim: "",
    major: "",
    bio: "",
    isPublic: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.fetchWithAuth("/api/users/me");
        const user = await res.json();
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || "",
          nim: user.nim || "",
        }));
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePublic = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await api.fetchWithAuth("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.fullName,
          nim: formData.nim || null,
          major: formData.major || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to update profile");
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-[#0a4b39] border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto pb-12 font-sans'>
      {/* Back Link */}
      <Link
        to='/profile'
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
        Back to My Profile
      </Link>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-[#0a4b39] tracking-tight'>
          Edit Profile
        </h1>
        <p className='text-slate-500 text-sm mt-1'>
          Keep your professional identity up to date for better career
          opportunities.
        </p>
      </div>

      {error && (
        <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm'>
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className='space-y-6'>
        <div className='bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 space-y-6'>
          {/* Row 1: Name & NIM */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
                Full Name
              </label>
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 outline-none transition-all'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
                NIM / Student ID
              </label>
              <input
                type='text'
                value={formData.nim}
                disabled
                className='w-full bg-slate-100 border border-slate-200 text-slate-400 text-sm rounded-lg block p-3 outline-none cursor-not-allowed'
              />
            </div>
          </div>

          {/* Row 2: Major */}
          <div className='space-y-2'>
            <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Major
            </label>
            <input
              type='text'
              name='major'
              value={formData.major}
              onChange={handleChange}
              className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 outline-none transition-all'
            />
          </div>

          {/* Row 3: Bio */}
          <div className='space-y-2'>
            <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Bio
            </label>
            <textarea
              name='bio'
              rows='4'
              value={formData.bio}
              onChange={handleChange}
              className='w-full border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 outline-none transition-all resize-none'
            />
          </div>

          {/* Row 4: Primary Skills */}
          <div className='space-y-3 pt-2'>
            <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Primary Skills
            </label>
            <div className='flex flex-wrap gap-2'>
              <span className='bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-xs font-semibold'>
                React.js
              </span>
              <span className='bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-xs font-semibold'>
                Python
              </span>
              <span className='bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-xs font-semibold'>
                UI Design
              </span>
              <span className='bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-xs font-semibold'>
                GraphQL
              </span>

              <button
                type='button'
                onClick={() => setShowAddSkill(true)}
                className='flex items-center gap-1 border border-dashed border-slate-300 text-slate-600 hover:text-[#0a4b39] hover:border-[#0a4b39] px-4 py-1.5 rounded-full text-xs font-semibold transition-colors'
              >
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
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                Add Skill
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end items-center gap-4 pt-6 mt-6 border-t border-slate-100'>
            <button
              type='button'
              onClick={() => navigate("/profile")}
              className='px-6 py-2.5 rounded-lg text-sm font-bold text-[#0a4b39] border border-[#0a4b39] hover:bg-slate-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving}
              className='px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0a4b39] hover:bg-[#083a2c] shadow-md shadow-[#0a4b39]/20 transition-colors disabled:opacity-50'
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Profile Visibility Banner */}
        <div className='bg-[#e6fcf5] border border-[#c3f4e3] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-[#20c997]/20 text-[#0a4b39] rounded-full flex items-center justify-center shrink-0'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-[#0a4b39] font-bold text-sm'>
                Your profile is currently{" "}
                {formData.isPublic ? "public" : "private"}
              </h3>
              <p className='text-[#0a4b39]/70 text-xs mt-0.5'>
                {formData.isPublic
                  ? "Employers can find and view your talent profile in search results."
                  : "Your profile is hidden from employers and search results."}
              </p>
            </div>
          </div>

          {/* Custom Toggle Switch */}
          <button
            type='button'
            onClick={togglePublic}
            className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData.isPublic ? "bg-[#0a4b39]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.isPublic ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </form>

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
        <AddSkillModal
          isOpen={showAddSkill}
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={() => {}}
        />
      </div>
    </div>
  );
}
