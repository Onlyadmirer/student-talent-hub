import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, SealCheck, PaperPlaneRight } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { userApi, skillApi, endorsementApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, imgErrorHandler } from "../types/index.ts";
import type { User, SkillCategory } from "../types/index.ts";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<User | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [allSkills, setAllSkills] = useState<SkillCategory[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    userApi.getById(Number(id)).then((res) => setStudent(res.data)).catch(() => navigate("/explore"));
    skillApi.getByUser(Number(id)).then((res) => setSkills(res.data)).catch(() => {});
    skillApi.getCategories().then((res) => setAllSkills(res.data)).catch(() => {});
  }, [id]);

  const handleEndorse = async () => {
    if (!selectedSkill || !message.trim() || !id) return;
    setSending(true);
    try {
      await endorsementApi.create({
        to_user_id: Number(id),
        skill_id: Number(selectedSkill),
        project_id: 0,
        message: message.trim(),
      });
      setMessage("");
      setSelectedSkill("");
    } catch {}
    setSending(false);
  };

  if (!student) return <DashboardLayout><div className="flex justify-center py-20 text-[#888]">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto w-full">
        <div
          onClick={() => navigate("/explore")}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Explore
        </div>

        <div
          className="w-full h-[220px] rounded-2xl flex items-end p-7 mb-7 shadow-sm"
          style={{
            background: `linear-gradient(to right, rgba(0,77,64,0.8), rgba(0,77,64,0.4)), url(${student.profile_picture || ""}) center/cover`,
            backgroundColor: "#004D40",
          }}
        >
          <div className="flex items-center gap-5">
            <img
              src={student.profile_picture || PLACEHOLDER_AVATAR}
              alt={student.name}
              className="w-[110px] h-[110px] rounded-2xl object-cover border-4 border-white"
              onError={imgErrorHandler}
            />
            <div>
              <h1 className="text-white text-[2.5rem] font-bold">{student.name}</h1>
              <p className="text-white/90 text-[0.95rem] font-medium">
                {student.major || "Student"} {student.nim ? `• ${student.nim}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-7 mb-7 max-md:grid-cols-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-[1.25rem] font-bold text-primary mb-5 flex items-center gap-2.5">
              About {student.name.split(" ")[0]}
            </h2>
            <div className="text-[#555] leading-relaxed text-[0.95rem]">
              {student.bio ? (
                <p>{student.bio}</p>
              ) : (
                <p className="text-[#888]">No bio yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-[1.25rem] font-bold text-primary mb-5">Expertise</h2>
            <div className="flex flex-col gap-3 items-start">
              {skills.length > 0 ? (
                skills.map((s: any) => (
                  <span key={s.id} className="bg-[#e0fdf4] text-[#0f766e] px-4 py-2 rounded-full text-[0.8rem] font-bold">
                    {typeof s.skill_id === "number"
                      ? allSkills.find((sk) => sk.id === s.skill_id)?.name || `Skill #${s.skill_id}`
                      : s.name || s.skill_id}
                  </span>
                ))
              ) : (
                <p className="text-[#888] text-sm">No skills listed yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-7">
          <h2 className="text-[1.25rem] font-bold text-primary mb-5 flex items-center gap-2.5">
            <SealCheck size={24} /> Give Endorsement
          </h2>
          <div className="mb-5">
            <label className="block text-[0.8rem] font-semibold text-[#333] mb-2">Related Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full max-w-[400px] p-3 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none bg-[#f9fafb] text-[#555]"
            >
              <option value="">Select a skill...</option>
              {allSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-[0.8rem] font-semibold text-[#333] mb-2">Endorsement Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your endorsement message..."
              className="w-full p-4 border border-[#eaeaea] rounded-lg text-[0.95rem] bg-[#f9fafb] outline-none h-[120px] resize-y"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleEndorse}
              disabled={!selectedSkill || !message.trim() || sending}
              className="bg-primary text-white border-none px-7 py-3.5 rounded-lg font-semibold text-[0.9rem] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              Submit Endorsement <PaperPlaneRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
