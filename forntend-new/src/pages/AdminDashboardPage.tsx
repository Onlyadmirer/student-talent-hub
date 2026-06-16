import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FolderSimple, Lightning, SealCheck, Student, Briefcase, Eye } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { adminApi } from "../services/api.ts";
import type { AdminDashboard } from "../types/index.ts";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20 text-[#888]">Loading...</div></DashboardLayout>;

  const cards = [
    { label: "Total Users", value: data?.total_users ?? 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Students", value: data?.total_students ?? 0, icon: Student, color: "bg-green-50 text-green-600" },
    { label: "Recruiters", value: data?.total_recruiters ?? 0, icon: Briefcase, color: "bg-purple-50 text-purple-600" },
    { label: "Projects", value: data?.total_projects ?? 0, icon: FolderSimple, color: "bg-amber-50 text-amber-600" },
    { label: "Open Collaborations", value: data?.open_projects ?? 0, icon: Eye, color: "bg-teal-50 text-teal-600" },
    { label: "Skill Categories", value: data?.total_skills ?? 0, icon: Lightning, color: "bg-rose-50 text-rose-600" },
    { label: "Endorsements", value: data?.total_endorsements ?? 0, icon: SealCheck, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[2.2rem] font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-[#666] text-[0.95rem]">Overview of the Student Talent Hub platform</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-[#f0f0f0]">
            <div className={`w-11 h-11 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
              <card.icon size={22} />
            </div>
            <p className="text-[1.5rem] font-bold text-[#111]">{card.value}</p>
            <p className="text-[0.8rem] text-[#666]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-7 max-md:grid-cols-1">
        <div className="bg-white rounded-2xl p-[30px] shadow-sm border border-[#f0f0f0]">
          <h2 className="text-[1.1rem] font-bold text-primary mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex items-center gap-3 p-4 border border-[#eaeaea] rounded-xl text-[0.9rem] font-semibold text-left hover:bg-[#f8fafc] cursor-pointer"
            >
              <Users size={20} className="text-primary" /> Manage Users
            </button>
            <button
              onClick={() => navigate("/admin/projects")}
              className="w-full flex items-center gap-3 p-4 border border-[#eaeaea] rounded-xl text-[0.9rem] font-semibold text-left hover:bg-[#f8fafc] cursor-pointer"
            >
              <FolderSimple size={20} className="text-primary" /> Manage Projects
            </button>
            <button
              onClick={() => navigate("/admin/skills")}
              className="w-full flex items-center gap-3 p-4 border border-[#eaeaea] rounded-xl text-[0.9rem] font-semibold text-left hover:bg-[#f8fafc] cursor-pointer"
            >
              <Lightning size={20} className="text-primary" /> Manage Skill Categories
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-[30px] shadow-sm border border-[#f0f0f0]">
          <h2 className="text-[1.1rem] font-bold text-primary mb-5">Recent Users</h2>
          {data?.recent_users && data.recent_users.length > 0 ? (
            <div className="space-y-3">
              {data.recent_users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center gap-3 pb-3 border-b border-[#f3f4f6] last:border-0">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#a7f3d0] flex items-center justify-center text-[0.75rem] font-bold text-[#111]">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.85rem] font-semibold text-[#111]">{u.name}</p>
                    <p className="text-[0.7rem] text-[#888]">{u.email} · {u.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-bold ${u.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#888] text-sm">No users yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
