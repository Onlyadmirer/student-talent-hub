import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon, GraduationCapIcon, CameraIcon, PencilSimpleIcon, QuotesIcon, SealCheckIcon } from '@phosphor-icons/react'
import DashboardLayout from '../components/layout/DashboardLayout.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { skillApi, endorsementApi } from '../services/api.ts'
import AddSkillModal from '../components/ui/AddSkillModal.tsx'
import type { UserSkill, EndorsementWithUser } from '../types/index.ts'
import { PLACEHOLDER_AVATAR, imgErrorHandler } from '../types/index.ts'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [endorsements, setEndorsements] = useState<EndorsementWithUser[]>([])

  const fetchSkills = () => {
    skillApi.getMySkills()
      .then((res) => setSkills(res.data))
      .catch(() => {})
  }

  useEffect(() => {
    if (user?.role === 'student') fetchSkills()
  }, [user])

  useEffect(() => {
    if (user?.id) {
      endorsementApi.getByUser(user.id)
        .then((res) => setEndorsements(res.data))
        .catch(() => {})
    }
  }, [user])

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
                  <CameraIcon size={14} />
                </div>
              </div>
              <div>
                <h1 className="text-[1.8rem] font-bold text-[#111] mb-1">{user?.name}</h1>
                <h2 className="text-base font-normal text-[#555] mb-3.5">{user?.major || '—'}</h2>
                <div className="flex gap-2.5">
                  {user?.batch_year && (
                    <span className="flex items-center gap-1 bg-[#f3f4f6] px-3 py-1.5 rounded-full text-[0.8rem] text-[#555] font-medium">
                      <GraduationCapIcon size={14} /> {user.batch_year}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-[#f3f4f6] px-3 py-1.5 rounded-full text-[0.8rem] text-[#555] font-medium">
                    <MapPinIcon size={14} /> {user?.role === 'recruiter' ? `NIP: ${user?.nim || '—'}` : user?.nim || '—'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg text-[0.9rem] font-semibold flex items-center gap-2 cursor-pointer"
            >
              <PencilSimpleIcon size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-2xl p-10 w-full mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[1.2rem] font-semibold text-primary">My Bio</h2>
            <QuotesIcon size={24} className="text-[#cbd5e1]" />
          </div>
          <p className="text-[#555] leading-relaxed text-[0.95rem]">
            {user?.bio || 'No bio yet.'}
          </p>
        </div>

        {user?.role === 'student' && (
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
        )}

        {user?.role === 'student' && endorsements.length > 0 && (
          <div className="bg-white rounded-2xl p-10 w-full mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-5">
              <SealCheckIcon size={24} className="text-primary" />
              <h2 className="text-[1.2rem] font-semibold text-primary">My Endorsements</h2>
              <span className="bg-[#a7f3d0] text-[#047857] px-3 py-1 rounded-full text-[0.75rem] font-bold">
                {endorsements.length}
              </span>
            </div>
            <div className="space-y-4">
              {endorsements.map((e) => (
                <div key={e.id} className="flex gap-4 p-4 bg-[#f9fafb] rounded-xl">
                  <img
                    src={e.from_user_profile_picture || PLACEHOLDER_AVATAR}
                    className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0"
                    alt=""
                    onError={imgErrorHandler}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[0.9rem] font-semibold text-[#111]">{e.from_user_name || `UserIcon #${e.from_user_id}`}</h4>
                    </div>
                    <p className="text-[0.85rem] text-[#555] leading-relaxed">&ldquo;{e.message}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {user?.role === 'student' && (
        <AddSkillModal
          isOpen={showAddSkill}
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchSkills}
          existingSkillIds={skills.map((s) => s.skill_id)}
        />
      )}
    </DashboardLayout>
  )
}
