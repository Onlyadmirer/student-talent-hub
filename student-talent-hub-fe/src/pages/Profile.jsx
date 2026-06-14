import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import AddSkillModal from "../components/AddSkillModal";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [showAddSkill, setShowAddSkill] = useState(false);

  const fetchProfile = async () => {
    try {
      const [userRes, skillsRes] = await Promise.all([
        api.fetchWithAuth("/api/users/me"),
        api.fetchWithAuth("/api/skills/user-skills/me"),
      ]);

      if (!userRes.ok) throw new Error("Failed to load profile");

      const userData = await userRes.json();
      const skillsData = skillsRes.ok ? await skillsRes.json() : [];

      setUser(userData);
      setSkills(skillsData);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-[#0a4b39] border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center text-slate-500 py-12'>
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-10'>
      {/* Card 1: Profile Header */}
      <div className='bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8'>
        {/* Avatar with Camera Icon */}
        <div className='relative shrink-0'>
          <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200'>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0a4b39&color=fff&size=256`}
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
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className='flex-1 text-center md:text-left mt-2'>
          <h1 className='text-3xl font-bold text-[#0a4b39]'>{user.name}</h1>
          <p className='text-slate-500 font-medium mt-1 capitalize'>
            {user.role}
          </p>
          {user.major && (
            <p className='text-slate-600 text-sm mt-0.5'>{user.major}</p>
          )}

          <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4'>
            {user.nim && (
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
                    d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0'
                  />
                </svg>
                NIM: {user.nim}
              </span>
            )}
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
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              {user.email}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <div className='mt-4 md:mt-0'>
          <button
            onClick={() => navigate("/profile/edit")}
            className='flex items-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer'
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
                d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
              />
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
          Passionate {user.role} with a strong focus on technology and
          innovation. Always eager to learn and collaborate on exciting new
          projects.
        </p>
      </div>

      {/* Card 3: My Skills */}
      <div className='bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-[#0a4b39]'>My Skills</h2>
          <button
            onClick={() => setShowAddSkill(true)}
            className='text-sm font-semibold text-slate-500 hover:text-[#0a4b39] flex items-center gap-1 transition-colors'
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
            Add Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <p className='text-slate-400 text-sm text-center py-8'>
            No skills added yet.
          </p>
        ) : (
          <div className='flex flex-wrap gap-3'>
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                  skill.proficiency_level === "expert"
                    ? "bg-teal-50 text-teal-800 border-teal-100"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {skill.skill_name}
                <span
                  className={`text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${
                    skill.proficiency_level === "expert"
                      ? "bg-[#0a4b39]"
                      : "bg-teal-500"
                  }`}
                >
                  {skill.proficiency_level.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddSkillModal
        isOpen={showAddSkill}
        onClose={() => setShowAddSkill(false)}
        onSkillAdded={fetchProfile}
      />
    </div>
  );
}
