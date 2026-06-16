import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Check, X, ArrowRight } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { requestApi } from "../services/api.ts";
import type { CollaborationRequest } from "../types/index.ts";

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestApi.getMyRequests().then((res) => {
      setRequests(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5"><Clock size={12} /> Pending</span>;
      case "accepted":
        return <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5"><Check size={12} /> Accepted</span>;
      case "rejected":
        return <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5"><X size={12} /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto w-full">
        <h1 className="text-[2rem] font-bold text-primary mb-1">My Collaboration Requests</h1>
        <p className="text-[#666] text-[0.95rem] mb-7">Track your requests to join projects</p>

        {loading ? (
          <div className="flex justify-center py-20 text-[#888]">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[#888] mb-4">You haven't sent any collaboration requests yet.</p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer"
            >
              Explore Projects
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#f0f0f0] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[1rem] font-bold text-primary">Project #{req.project_id}</h3>
                    {statusBadge(req.status)}
                  </div>
                  <p className="text-[0.85rem] text-[#555]">
                    Requested role: <span className="font-semibold text-[#111]">{req.role}</span>
                  </p>
                  {req.message && (
                    <p className="text-[0.8rem] text-[#666] mt-1 italic">"{req.message}"</p>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/projects/${req.project_id}`)}
                  className="bg-white text-primary border border-primary px-4 py-2 rounded-lg text-[0.8rem] font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                >
                  View Project <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
