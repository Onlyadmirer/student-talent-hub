import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, GraduationCap, Camera, PencilSimple, Quotes } from '@phosphor-icons/react'
import DashboardLayout from '../components/layout/DashboardLayout.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { skillApi } from '../services/api.ts'
import AddSkillModal from '../components/ui/AddSkillModal.tsx'
import type { UserSkill } from '../types/index.ts'
import { PLACEHOLDER_AVATAR, imgErrorHandler } from '../types/index.ts'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [showAddSkill, setShowAddSkill] = useState(false)

  const fetchSkills = () => {
    skillApi.getMySkills()
      .then((res) => setSkills(res.data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const levelLabel = (level: string) => level.charAt(0).toUpperCase() + level.slice(1)
  const proficiencyColor = (level: string) => {
    if (level === 'expert') return 'bg-primary text-white'
    if (level === 'advanced') return 'bg-[#0d9488] text-white'
    if (level === 'intermediate') return 'bg-[#14b8a6] text-white'
    return 'bg-[#5eead4] text-[#0f766e]'
  }

  const tagColor = (level: string) => {
    if (['expert', 'advanced'].includes(level)) return 'bg-[#ccfbf1] text-[#0f766e]'
    return 'bg-[#f3f4f6] text-[#374151]'
  }

  console.log(user?.profile_picture)

  return (  
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto flex flex-col items-center">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-10 w-full mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-[30px]">
              <div className="relative w-[120px] h-[120px]">
                <img
                  src={user?.profile_picture || PLACEHOLDER_AVATAR}
                  alt={user?.name}
                  className="w-full h-full rounded-full object-cover border-4 border-[#f0fdf4]"
                  onError={imgErrorHandler}
                />
                <div className="absolute bottom-[5px] right-[5px] bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                  <Camera size={14} />
                </div>
              </div>
              <div>
                <h1 className="text-[1.8rem] font-bold text-[#111] mb-1">{user?.name}</h1>
                <h2 className="text-base font-normal text-[#555] mb-3.5">{user?.major || '—'}</h2>
                <div className="flex gap-2.5">
                  {user?.batch_year && (
                    <span className="flex items-center gap-1 bg-[#f3f4f6] px-3 py-1.5 rounded-full text-[0.8rem] text-[#555] font-medium">
                      <GraduationCap size={14} /> {user.batch_year}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-[#f3f4f6] px-3 py-1.5 rounded-full text-[0.8rem] text-[#555] font-medium">
                    <MapPin size={14} /> {user?.nim || '—'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg text-[0.9rem] font-semibold flex items-center gap-2 cursor-pointer"
            >
              <PencilSimple size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-2xl p-10 w-full mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[1.2rem] font-semibold text-primary">My Bio</h2>
            <Quotes size={24} className="text-[#cbd5e1]" />
          </div>
          <p className="text-[#555] leading-relaxed text-[0.95rem]">
            {user?.bio || 'No bio yet.'}
          </p>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-2xl p-10 w-full mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[1.2rem] font-semibold text-primary">My Skills</h2>
            <button
              onClick={() => setShowAddSkill(true)}
              className="text-primary bg-none border-none font-semibold text-[0.9rem] cursor-pointer"
            >
              + Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-3.5">
            {skills.length > 0 ? (
              skills.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-[0.9rem] font-medium ${tagColor(s.proficiency_level)}`}
                >
                  {s.skill_name || `Skill #${s.skill_id}`}
                  <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${proficiencyColor(s.proficiency_level)}`}>
                    {levelLabel(s.proficiency_level)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#888] text-sm">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>

      <AddSkillModal
        isOpen={showAddSkill}
        onClose={() => setShowAddSkill(false)}
        onSkillAdded={fetchSkills}
        existingSkillIds={skills.map((s) => s.skill_id)}
      />
    </DashboardLayout>
  )
}
