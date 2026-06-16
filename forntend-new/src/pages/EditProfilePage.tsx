import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye } from '@phosphor-icons/react'
import DashboardLayout from '../components/layout/DashboardLayout.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { userApi, skillApi } from '../services/api.ts'
import AddSkillModal from '../components/ui/AddSkillModal.tsx'
import type { UserSkill } from '../types/index.ts'
import { PLACEHOLDER_AVATAR, imgErrorHandler } from '../types/index.ts'

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [nim, setNim] = useState('')
  const [major, setMajor] = useState('')
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setNim(user.nim || '')
      setMajor(user.major || '')
      setBio(user.bio || '')
      setProfilePicture(user.profile_picture || '')
    }
    skillApi.getMySkills()
      .then((res) => setSkills(res.data))
      .catch(() => {})
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await userApi.updateProfile({
        name,
        major,
        nim,
        bio: bio || null,
        profile_picture: profilePicture || null,
      })
      await refreshUser()
      navigate('/profile')
    } catch {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-primary text-[0.9rem] font-semibold mb-5 cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to My Profile
        </div>

        <h1 className="text-[2rem] font-bold text-primary mb-1">Edit Profile</h1>
        <p className="text-[#555] text-[0.9rem] mb-7">Keep your professional identity up to date for better career opportunities.</p>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-10 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex gap-5 mb-5 max-md:flex-col">
            <div className="flex-1">
              <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">Profile Picture URL</label>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={profilePicture || PLACEHOLDER_AVATAR}
                  alt="Profile Preview"
                  className="w-[70px] h-[70px] rounded-full object-cover border-2 border-[#e5e7eb]"
                  onError={imgErrorHandler}
                />
                <input
                  type="text"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 p-3.5 border border-[#e5e7eb] rounded-lg text-[0.9rem] text-[#333] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-5 mb-5 max-md:flex-col">
            <div className="flex-1">
              <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3.5 border border-[#e5e7eb] rounded-lg text-[0.9rem] text-[#333] outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">NIM / Student ID</label>
              <input
                type="text"
                value={nim}
                disabled
                className="w-full p-3.5 border border-[#e5e7eb] rounded-lg text-[0.9rem] bg-[#f3f4f6] text-[#888] outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">Major</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full p-3.5 border border-[#e5e7eb] rounded-lg text-[0.9rem] text-[#333] outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 border border-[#e5e7eb] rounded-lg text-[0.9rem] text-[#333] outline-none resize-y min-h-[100px] leading-relaxed"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[0.75rem] font-bold text-[#555] uppercase tracking-wide mb-2">Primary Skills</label>
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              {skills.map((s) => (
                <span key={s.id} className="bg-[#e0fdf4] text-primary px-4 py-2 rounded-full text-[0.8rem] font-semibold">
                  {s.skill_name || `Skill #${s.skill_id}`}
                </span>
              ))}
              <button
                onClick={() => setShowAddSkill(true)}
                className="bg-white text-[#555] border border-dashed border-[#ccc] px-4 py-2 rounded-full text-[0.8rem] font-semibold cursor-pointer"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 mt-10">
            <button
              onClick={() => navigate('/profile')}
              className="border border-primary text-primary bg-none px-6 py-3 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="bg-[#e0fdf4] rounded-2xl p-[25px_30px] flex items-center justify-between border border-[#ccfbf1] mb-6">
          <div className="flex items-center gap-5">
            <div className="w-[45px] h-[45px] bg-[#bbf7d0] text-primary rounded-full flex items-center justify-center text-[1.5rem]">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-base text-primary font-semibold mb-1">Your profile is currently public</h3>
              <p className="text-[0.8rem] text-[#0f766e]">Employers can find and view your talent profile in search results.</p>
            </div>
          </div>
          <label className="relative inline-block w-[50px] h-[26px]">
            <input type="checkbox" defaultChecked className="opacity-0 w-0 h-0" />
            <span className="absolute cursor-pointer inset-0 bg-primary rounded-[34px] transition-all before:absolute before:h-5 before:w-5 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all before:content-['']" />
          </label>
        </div>
      </div>

      <AddSkillModal
        isOpen={showAddSkill}
        onClose={() => setShowAddSkill(false)}
        onSkillAdded={() => skillApi.getMySkills().then((res) => setSkills(res.data))}
        existingSkillIds={skills.map((s) => s.skill_id)}
      />
    </DashboardLayout>
  )
}
