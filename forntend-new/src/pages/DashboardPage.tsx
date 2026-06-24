import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { ClipboardTextIcon, LightningIcon, SealCheckIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import StatCard from "../components/ui/StatCard.tsx";
import ProjectItem from "../components/ui/ProjectItem.tsx";
import CollabCard from "../components/ui/CollabCard.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { projectApi, userApi } from "../services/api.ts";
import type { Project, DashboardStats, RecentProject } from "../types/index.ts";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [openProjects, setOpenProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userApi
        .getDashboardStats()
        .then((res) => {
          setDashboardStats(res.data);
        })
        .catch(() => {}),
      projectApi
        .getAll()
        .then((res) => {
          const all: Project[] = res.data;
          setOpenProjects(all.filter((p: Project) => p.is_open));
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-[#666]">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-[2.2rem] font-bold mb-2 text-[#333]">
          Welcome back, {user?.name || "UserIcon"}!
        </h1>
        <p className="text-sm text-[#666]">
          Here is what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-1">
        <StatCard
          icon={<ClipboardTextIcon size={24} />}
          iconBgClass="bg-icon-cyan-bg"
          iconColorClass="text-icon-cyan"
          value={`${dashboardStats?.total_projects ?? 0} Projects`}
          label="Active Engagements"
        />
        <StatCard
          icon={<LightningIcon size={24} />}
          iconBgClass="bg-icon-green-bg"
          iconColorClass="text-icon-green"
          value={`${dashboardStats?.total_skills ?? 0} Skills`}
          label="Verified Competencies"
        />
        <StatCard
          icon={<SealCheckIcon size={24} />}
          iconBgClass="bg-icon-orange-bg"
          iconColorClass="text-icon-orange"
          value={`${dashboardStats?.total_endorsements ?? 0} Endorsements`}
          label="From Mentors"
        />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-8 max-md:grid-cols-1">
        <div>
          <div className="flex justify-between items-end mb-5">
            <h2 className="font-heading text-[1.5rem] font-bold text-primary">
              Recent Projects
            </h2>
            <Link
              to="/projects"
              className="text-sm text-[#555] font-semibold no-underline hover:text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="bg-white rounded-xl py-2.5 px-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-card-border">
            {dashboardStats && dashboardStats.recent_projects.length > 0 ? (
              dashboardStats.recent_projects.map((p: RecentProject) => (
                <ProjectItem
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  meta={`Created ${p.created_at ? new Date(p.created_at).toLocaleDateString() : "recently"}`}
                  status="Active"
                  imageUrl={p.thumbnail_url || undefined}
                />
              ))
            ) : (
              <p className="text-center text-[#888] py-8 text-sm">
                No projects yet. Create your first project!
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-5">
            <h2 className="font-heading text-[1.5rem] font-bold text-primary leading-tight">
              Open for
              <br />
              Collaboration
            </h2>
          </div>
          {openProjects.length > 0 ? (
            openProjects
              .slice(0, 3)
              .map((p) => (
                <CollabCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description}
                  avatarCount={1}
                />
              ))
          ) : (
            <div className="bg-white rounded-xl p-6 border border-card-border text-center">
              <p className="text-sm text-[#888]">No open collaborations yet.</p>
            </div>
          )}
          <Link
            to="/explore"
            className="block text-center text-sm text-primary font-semibold mt-5 pb-2.5 no-underline hover:underline"
          >
            Explore More Opportunities
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
