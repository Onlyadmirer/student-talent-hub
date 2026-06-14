import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AddSkillModal({ isOpen, onClose, onSkillAdded }) {
  const [masterSkills, setMasterSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiency, setProficiency] = useState("Beginner");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchSkills = async () => {
      try {
        const res = await api.fetchWithAuth("/api/skills/categories");
        if (res.ok) {
          const data = await res.json();
          setMasterSkills(data);
        }
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };
    fetchSkills();
    setSelectedSkill("");
    setProficiency("Beginner");
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSkill) {
      setError("Please select a skill first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await api.fetchWithAuth("/api/skills/user-skills", {
        method: "POST",
        body: JSON.stringify({
          skill_id: parseInt(selectedSkill, 10),
          proficiency_level: proficiency.toLowerCase(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save skill");
      }

      onSkillAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 pb-4 border-b border-slate-100'>
          <h2 className='text-xl font-bold text-[#0a4b39]'>Add New Skill</h2>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 transition-colors p-1'
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
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave}>
          <div className='p-6 space-y-6'>
            {error && (
              <div className='bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Field: Select Skill */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                Select Skill
              </label>
              <div className='relative'>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className='w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0a4b39] focus:border-[#0a4b39] block p-3 pr-10 outline-none transition-all cursor-pointer'
                >
                  <option value='' disabled>
                    Choose from master data...
                  </option>
                  {masterSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400'>
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

            {/* Field: Proficiency Level */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                Proficiency Level
              </label>
              <div className='flex bg-slate-100 p-1 rounded-xl'>
                {["Beginner", "Intermediate", "Expert"].map((level) => (
                  <button
                    key={level}
                    type='button'
                    onClick={() => setProficiency(level)}
                    className={`flex-1 text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 ${
                      proficiency === level
                        ? "bg-white text-[#0a4b39] shadow-sm ring-1 ring-slate-900/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end items-center gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-100'>
            <button
              type='button'
              onClick={onClose}
              className='text-sm font-bold text-[#0a4b39] hover:underline px-2'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving}
              className='px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0a4b39] hover:bg-[#083a2c] shadow-md shadow-[#0a4b39]/20 transition-colors disabled:opacity-50'
            >
              {saving ? "Saving..." : "Save Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
