import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkIcon, SealCheckIcon, UsersIcon, ArrowRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { recruiterApi } from "../services/api.ts";
import { imgErrorHandler } from "../types/index.ts";
import type { RecruiterDashboard } from "../types/index.ts";
import { PLACEHOLDER_AVATAR } from "../types/index.ts";

export default function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recruiterApi.getDashboard().then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20 text-[#888]">Loading...</div></DashboardLayout>;

  const cards = [
    { label: "Total Students", value: data?.total_students ?? 0, icon: UsersIcon, color: "bg-blue-50 text-blue-600" },
    { label: "Saved Students", value: data?.total_saved ?? 0, icon: BookmarkIcon, color: "bg-amber-50 text-amber-600" },
    { label: "Endorsements Given", value: data?.total_endorsements_given ?? 0, icon: SealCheckIcon, color: "bg-green-50 text-green-600" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto w-full">
        <h1 className="text-[2.2rem] font-bold text-primary mb-2">Recruiter Dashboard</h1>
        <p className="text-[#666] text-[0.95rem] mb-8">Discover and connect with top student talent</p>

        <div className="grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-1">
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
                onClick={() => navigate("/explore")}
                className="w-full flex items-center gap-3 p-4 border border-[#eaeaea] rounded-xl text-[0.9rem] font-semibold text-left hover:bg-[#f8fafc] cursor-pointer"
              >
                <MagnifyingGlassIcon size={20} className="text-primary" /> Explore Students
              </button>
              <button
                onClick={() => navigate("/recruiter/saved")}
                className="w-full flex items-center gap-3 p-4 border border-[#eaeaea] rounded-xl text-[0.9rem] font-semibold text-left hover:bg-[#f8fafc] cursor-pointer"
              >
                <BookmarkIcon size={20} className="text-primary" /> View Saved Students
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-[30px] shadow-sm border border-[#f0f0f0]">
            <h2 className="text-[1.1rem] font-bold text-primary mb-5">Recently Saved</h2>
            {data?.recent_saved && data.recent_saved.length > 0 ? (
              <div className="space-y-3">
                {data.recent_saved.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/recruiter/students/${s.id}`)}
                    className="flex items-center gap-3 pb-3 border-b border-[#f3f4f6] last:border-0 cursor-pointer hover:opacity-80"
                  >
                    <img
                      src={PLACEHOLDER_AVATAR}
                      className="w-[36px] h-[36px] rounded-full object-cover"
                      onError={imgErrorHandler}
                      alt=""
                    />
                    <div className="flex-1">
                      <p className="text-[0.85rem] font-semibold text-[#111]">{s.name}</p>
                      <p className="text-[0.7rem] text-[#888]">{s.major || "—"}</p>
                    </div>
                    <ArrowRightIcon size={16} className="text-[#888]" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888] text-sm">No saved students yet. Start exploring!</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
