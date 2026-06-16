import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { projectApi, userApi, skillApi, recruiterApi } from "../services/api.ts";
import { PLACEHOLDER_COVER, PLACEHOLDER_AVATAR, coverErrorHandler, imgErrorHandler } from "../types/index.ts";
import type { Project, User, SkillCategory, UserSkillBrief } from "../types/index.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function ExploreProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"projects" | "students">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [skillsByUser, setSkillsByUser] = useState<Record<number, UserSkillBrief[]>>({});
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const isRecruiter = user?.role === "recruiter";

  const [filterCatId, setFilterCatId] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [filterMajor, setFilterMajor] = useState("");

  const loadStudents = useCallback(async (skillId: string, level: string, major: string) => {
    const params: Record<string, unknown> = {};
    if (major) params.major = major;
    if (skillId) params.skill_id = Number(skillId);
    if (level) params.proficiency_level = level;
    try {
      const res = isRecruiter ? await recruiterApi.getStudents(params) : await userApi.getAll(params);
      const users: User[] = res.data;
      setStudents(users);
      if (isRecruiter) {
        setSavedIds(new Set(users.filter((u: any) => u.is_saved).map((u: any) => u.id)));
      }
      const ids = users.map((u) => u.id);
      if (ids.length > 0) {
        const skillRes = await skillApi.getBulk(ids);
        setSkillsByUser(skillRes.data);
      } else {
        setSkillsByUser({});
      }
    } catch {
      setStudents([]);
    }
  }, [isRecruiter]);

  useEffect(() => {
    projectApi.getAll().then((res) => setProjects(res.data)).catch(() => {});
    skillApi.getCategories().then((res) => setCategories(res.data)).catch(() => {});
    loadStudents("", "", "");
  }, [loadStudents]);

  const filteredProjects = projects;

  const majors = [...new Set(students.map((s) => s.major).filter(Boolean))] as string[];

  const handleApply = () => {
    loadStudents(filterCatId, proficiencyLevel, filterMajor);
  };

  function getStudentSkills(userId: number): UserSkillBrief[] {
    return skillsByUser[userId] || [];
  }

  const toggleSave = async (studentId: number) => {
    try {
      if (savedIds.has(studentId)) {
        await recruiterApi.unsaveStudent(studentId);
        setSavedIds((prev) => { const n = new Set(prev); n.delete(studentId); return n; });
      } else {
        await recruiterApi.saveStudent(studentId);
        setSavedIds((prev) => new Set(prev).add(studentId));
      }
    } catch { /* ignore */ }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[2.2rem] font-bold text-primary mb-2">
              {mode === "projects" ? "Find Your Next Venture" : "Search Top Student Talent"}
            </h1>
            <p className="text-[#555] text-[0.95rem] max-w-[500px]">
              {mode === "projects"
                ? "Connect with visionary students and join projects that match your skills and ambitions."
                : "Connecting ambitious students with professional excellence."}
            </p>
          </div>
          <div className="flex bg-[#f3f4f6] p-1 rounded-lg">
            <button
              className={`px-5 py-2.5 rounded-md text-[0.85rem] font-semibold cursor-pointer border-none transition-all ${
                mode === "projects" ? "bg-white text-[#111] shadow-sm" : "bg-transparent text-[#555]"
              }`}
              onClick={() => setMode("projects")}
            >
              Explore Projects
            </button>
            <button
              className={`px-5 py-2.5 rounded-md text-[0.85rem] font-semibold cursor-pointer border-none transition-all ${
                mode === "students" ? "bg-white text-[#111] shadow-sm" : "bg-transparent text-[#555]"
              }`}
              onClick={() => setMode("students")}
            >
              Explore Students
            </button>
          </div>
        </div>

        {mode === "projects" && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="relative w-full h-[160px]">
                  <img
                    src={p.thumbnail_url || PLACEHOLDER_COVER}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={coverErrorHandler}
                  />
                  <span className="absolute top-3 left-3 bg-[rgba(22,101,52,0.9)] text-[#dcfce7] px-2.5 py-1 rounded-full text-[0.65rem] font-bold flex items-center gap-1.5 backdrop-blur">
                    {p.is_open ? "Recruitment: Open" : "Closed"}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[1.15rem] font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-[0.8rem] text-[#555] leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>
                  <div className="flex justify-between items-center pt-3.5 border-t border-[#f3f4f6]">
                    <div className="flex items-center gap-2.5">
                      <img src={PLACEHOLDER_AVATAR} className="w-[30px] h-[30px] rounded-full object-cover" alt="" />
                      <div>
                        <h4 className="text-[0.8rem] font-semibold text-[#111]">{p.owner_name || "User"}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <p className="col-span-full text-center text-[#888] py-10">No projects found.</p>
            )}
          </div>
        )}

        {mode === "students" && (
          <div className="flex gap-8 items-start">
            <div className="w-[260px] shrink-0 bg-white rounded-xl p-6 shadow-sm border border-[#f0f0f0]">
              <p className="text-[0.75rem] font-bold text-primary mb-6 tracking-wider">FILTER PANEL</p>

              <div className="mb-5">
                <label className="block text-[0.7rem] font-semibold text-[#64748b] mb-2">Skill Category</label>
                <select
                  value={filterCatId}
                  onChange={(e) => setFilterCatId(e.target.value)}
                  className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[0.85rem] outline-none appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-[0.7rem] font-semibold text-[#64748b] mb-2">Proficiency Level</label>
                <select
                  value={proficiencyLevel}
                  onChange={(e) => setProficiencyLevel(e.target.value)}
                  className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[0.85rem] outline-none appearance-none"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-[0.7rem] font-semibold text-[#64748b] mb-2">Major</label>
                <select
                  value={filterMajor}
                  onChange={(e) => setFilterMajor(e.target.value)}
                  className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[0.85rem] outline-none appearance-none"
                >
                  <option value="">All Majors</option>
                  {majors.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3.5 bg-primary text-white border-none rounded-lg font-semibold text-[0.85rem] cursor-pointer hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </button>
            </div>

            <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {students.map((s) => {
                const skills = getStudentSkills(s.id);
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-xl p-8 shadow-sm border border-[#f0f0f0] flex flex-col items-center text-center"
                  >
                    <img
                      src={s.profile_picture || PLACEHOLDER_AVATAR}
                      alt={s.name}
                      className="w-[88px] h-[88px] rounded-full object-cover mb-4 border-[3px] border-[#f1f5f9]"
                      onError={imgErrorHandler}
                    />
                    <h3 className="text-[1.2rem] font-bold text-primary mb-1">{s.name}</h3>
                    <p className="text-[0.85rem] text-[#475569] mb-5">{s.major || "—"}</p>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-7">
                        {skills.map((sk) => (
                          <span
                            key={sk.skill_id}
                            className="bg-[#e0f2f1] text-[#00695c] px-3 py-1.5 rounded-full text-[0.7rem] font-semibold"
                          >
                            {sk.skill_name}
                          </span>
                        ))}
                      </div>
                    )}

                    {isRecruiter && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(s.id); }}
                        className={`w-full py-3 border-none rounded-lg font-medium text-[0.85rem] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${
                          savedIds.has(s.id)
                            ? "bg-amber-50 text-amber-700"
                            : "bg-primary text-white"
                        }`}
                      >
                        <Bookmark size={16} weight={savedIds.has(s.id) ? "fill" : "regular"} />
                        {savedIds.has(s.id) ? "Saved" : "Save"}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/recruiter/students/${s.id}`)}
                      className={`w-full py-3 border-none rounded-lg font-medium text-[0.85rem] cursor-pointer hover:opacity-90 transition-opacity ${
                        isRecruiter ? "bg-[#222] text-white mt-2" : "bg-primary text-white"
                      }`}
                    >
                      View Portfolio
                    </button>
                  </div>
                );
              })}
              {students.length === 0 && (
                <p className="col-span-full text-center text-[#888] py-10">No students found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
