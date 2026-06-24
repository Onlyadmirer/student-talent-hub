import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, PlusCircleIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { projectApi } from "../services/api.ts";
import type { Project } from "../types/index.ts";
import { PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";

export default function MyProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectApi.getAll().then((res) => {
      const mine = res.data.filter(
        (p: Project) => p.owner_id === user?.id,
      );
      setProjects(mine);
    }).catch(() => {});
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-7">
        <div>
          <h1 className="font-heading text-[2rem] font-bold text-primary mb-1">
            My Projects
          </h1>
          <p className="text-[#666] text-[0.95rem]">
            Manage and showcase your professional portfolio
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")}
          className="bg-primary text-white border-none px-5 py-3 rounded-lg font-semibold flex items-center gap-2 text-[0.9rem] cursor-pointer"
        >
          <PlusIcon size={18} /> Upload New Project
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-[#f0f0f0] flex flex-col cursor-pointer"
          >
            <img
              src={p.thumbnail_url || PLACEHOLDER_COVER}
              alt={p.title}
              className="w-full h-[160px] object-cover bg-[#e5e7eb]"
              onError={coverErrorHandler}
            />
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-heading text-[1.25rem] font-bold text-primary mb-2.5 leading-tight">
                {p.title}
              </h3>
              <p className="text-[0.85rem] text-[#555] leading-relaxed mb-5 flex-1">
                {p.description}
              </p>
              <div className="flex gap-2.5 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-[0.7rem] font-bold ${
                    p.status === "published"
                      ? "bg-[#ccfbf1] text-[#0f766e]"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
                >
                  Status: {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[0.7rem] font-bold ${
                    p.is_open
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#fee2e2] text-[#991b1b]"
                  }`}
                >
                  {p.is_open ? "Recruitment: Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* New Project Card */}
        <div
          onClick={() => navigate("/projects/new")}
          className="border-2 border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center min-h-[350px] cursor-pointer bg-transparent hover:bg-[#f1f5f9] hover:text-primary text-[#888] transition-colors"
        >
          <PlusCircleIcon size={40} className="mb-2.5" />
          <span className="text-[0.9rem] font-semibold">New Project</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
