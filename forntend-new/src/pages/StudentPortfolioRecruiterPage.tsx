import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { userApi, projectApi, skillApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, PLACEHOLDER_COVER, coverErrorHandler, imgErrorHandler } from "../types/index.ts";
import type { User, UserSkillBrief } from "../types/index.ts";

export default function StudentPortfolioRecruiterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<User | null>(null);
  const [skills, setSkills] = useState<UserSkillBrief[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const userId = Number(id);

    userApi.getById(userId).then((res) => setStudent(res.data)).catch(() => navigate("/explore"));

    skillApi.getByUser(userId).then((res) => {
      setSkills(res.data.map((s: any) => ({
        skill_id: s.skill_id,
        skill_name: s.skill_name,
        proficiency_level: s.proficiency_level,
      })));
    }).catch(() => {});

    projectApi.getAll().then((res) => {
      const mine = res.data.filter((p: any) => p.owner_id === userId);
      setProjects(mine);
    }).catch(() => {});
  }, [id, navigate]);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20 text-[#888]">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto w-full">
        <div
          onClick={() => navigate("/explore")}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Explore
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#f0f0f0] flex flex-col items-center text-center mb-8">
          <img
            src={student.profile_picture || PLACEHOLDER_AVATAR}
            alt={student.name}
            className="w-[100px] h-[100px] rounded-full object-cover mb-4 border-[3px] border-[#f1f5f9]"
            onError={imgErrorHandler}
          />
          <h1 className="text-[1.8rem] font-bold text-primary mb-1">{student.name}</h1>
          <p className="text-[0.95rem] text-[#475569] mb-5">{student.major || "—"}</p>
          {student.bio && (
            <p className="text-[0.85rem] text-[#555] max-w-[500px] leading-relaxed">{student.bio}</p>
          )}
        </div>

        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[1.1rem] font-bold text-primary mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((sk) => (
                <div
                  key={sk.skill_id}
                  className="bg-[#e0f2f1] text-[#00695c] px-4 py-2 rounded-full text-[0.8rem] font-semibold flex items-center gap-2"
                >
                  <span>{sk.skill_name}</span>
                  <span className="text-[0.65rem] text-[#009688] opacity-70">• {sk.proficiency_level}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[1.1rem] font-bold text-primary mb-4">Projects ({projects.length})</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                >
                  <img
                    src={p.thumbnail_url || PLACEHOLDER_COVER}
                    alt={p.title}
                    className="w-full h-[150px] object-cover"
                    onError={coverErrorHandler}
                  />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[1.05rem] font-bold text-primary mb-2">{p.title}</h3>
                    <p className="text-[0.8rem] text-[#555] leading-relaxed flex-1 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#f3f4f6]">
                      <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                        p.is_open ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
                      }`}>
                        {p.is_open ? "Open" : "Closed"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                        p.status === "published" ? "bg-[#ccfbf1] text-[#0f766e]" : "bg-[#f3f4f6] text-[#6b7280]"
                      }`}>
                        {p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length === 0 && projects.length === 0 && (
          <p className="text-center text-[#888] py-10">No skills or projects to display.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
