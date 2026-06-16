import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ArrowRight, Trash, ArrowLeft } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { recruiterApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, imgErrorHandler } from "../types/index.ts";
import type { User } from "../types/index.ts";

export default function RecruiterSavedPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    recruiterApi.getSavedStudents().then((res) => setStudents(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUnsave = async (studentId: number) => {
    try {
      await recruiterApi.unsaveStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch {
      alert("Failed to unsave student.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft size={20} className="text-primary cursor-pointer" onClick={() => window.history.back()} />
          <h1 className="text-[2rem] font-bold text-primary">Saved Students</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#888]">Loading...</div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#f0f0f0]">
            <Bookmark size={40} className="mx-auto mb-4 text-[#ccc]" />
            <p className="text-[#888] mb-4">You haven't saved any students yet.</p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer"
            >
              Explore Students
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {students.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 shadow-sm border border-[#f0f0f0] flex flex-col items-center text-center">
                <img
                  src={PLACEHOLDER_AVATAR}
                  alt={s.name}
                  className="w-[80px] h-[80px] rounded-full object-cover mb-4 border-[3px] border-[#f1f5f9]"
                  onError={imgErrorHandler}
                />
                <h3 className="text-[1.1rem] font-bold text-primary mb-1">{s.name}</h3>
                <p className="text-[0.85rem] text-[#475569] mb-5">{s.major || "—"}</p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => navigate(`/recruiter/students/${s.id}`)}
                    className="flex-1 bg-primary text-white border-none px-4 py-2.5 rounded-lg text-[0.8rem] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    View Portfolio <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => handleUnsave(s.id)}
                    className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-100"
                    title="Remove from saved"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
