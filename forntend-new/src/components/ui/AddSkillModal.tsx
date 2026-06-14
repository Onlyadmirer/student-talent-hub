import { useState, useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import { skillApi } from '../../services/api.ts'
import type { SkillCategory } from '../../types/index.ts'

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSkillAdded: () => void
  existingSkillIds: number[]
}

const levels = ['Beginner', 'Intermediate', 'Expert']

export default function AddSkillModal({ isOpen, onClose, onSkillAdded, existingSkillIds }: AddSkillModalProps) {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('')
  const [proficiency, setProficiency] = useState('intermediate')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      skillApi.getCategories()
        .then((res) => setCategories(res.data.filter((s: SkillCategory) => !existingSkillIds.includes(s.id))))
        .catch(() => {})
    }
  }, [isOpen, existingSkillIds])

  const handleSave = async () => {
    if (!selectedSkillId) return
    setLoading(true)
    try {
      await skillApi.addSkill({ skill_id: selectedSkillId as number, proficiency_level: proficiency })
      onSkillAdded()
      onClose()
    } catch {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedSkillId('')
    setProficiency('intermediate')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(230,235,235,0.85)] backdrop-blur-sm">
      <div className="bg-white w-full max-w-[450px] rounded-2xl p-[35px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative">
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="text-[1.5rem] font-bold text-primary">Add New Skill</h2>
          <button onClick={handleClose} className="bg-none border-none text-[#555] text-lg cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="mb-[25px]">
          <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Select Skill</label>
          <div className="relative">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value ? Number(e.target.value) : '')}
              className="w-full py-3.5 px-4 border border-[#e5e7eb] rounded-lg text-sm text-[#6b7280] outline-none appearance-none bg-white"
            >
              <option value="" disabled>Choose from master data...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-[25px]">
          <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Proficiency Level</label>
          <div className="flex bg-[#f3f4f6] rounded-lg p-[4px]">
            {levels.map((level) => {
              const val = level.toLowerCase()
              return (
                <div
                  key={level}
                  onClick={() => setProficiency(val)}
                  className={`flex-1 text-center py-2.5 text-[0.85rem] font-semibold cursor-pointer rounded-md transition-all ${
                    proficiency === val
                      ? 'bg-white text-[#111] shadow-[0_2px_5px_rgba(0,0,0,0.05)]'
                      : 'text-[#555]'
                  }`}
                >
                  {level}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end items-center gap-5 mt-10">
          <button onClick={handleClose} className="bg-none border-none text-primary text-[0.9rem] font-semibold cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedSkillId || loading}
            className="bg-primary text-white border-none px-6 py-3 rounded-lg text-[0.9rem] font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Skill'}
          </button>
        </div>
      </div>
    </div>
  )
}
