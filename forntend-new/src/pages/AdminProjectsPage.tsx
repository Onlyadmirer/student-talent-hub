import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon, ArrowLeftIcon, EyeIcon } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { adminApi } from "../services/api.ts";
import { PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";
import type { Project } from "../types/index.ts";
import ConfirmModal from "../components/ui/ConfirmModal.tsx";

export default function AdminProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getProjects().then((res) => setProjects(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch {
      alert("Failed to delete project.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftIcon size={20} className="text-primary cursor-pointer" onClick={() => window.history.back()} />
          <h1 className="text-[2rem] font-bold text-primary">Manage Projects</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#888]">Loading...</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {projects.map((p) => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] flex flex-col">
                <div className="relative w-full h-[140px]">
                  <img
                    src={p.thumbnail_url || PLACEHOLDER_COVER}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={coverErrorHandler}
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.6rem] font-bold ${
                    p.is_open ? "bg-[rgba(22,101,52,0.9)] text-[#dcfce7]" : "bg-[rgba(153,27,27,0.9)] text-[#fee2e2]"
                  }`}>
                    {p.is_open ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[1rem] font-bold text-primary mb-1">{p.title}</h3>
                  <p className="text-[0.75rem] text-[#888] mb-3">by {p.owner_name || "UserIcon"}</p>
                  <p className="text-[0.8rem] text-[#555] leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="flex-1 bg-white text-primary border border-primary px-3 py-2 rounded-lg text-[0.75rem] font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#f8fafc]"
                    >
                      <EyeIcon size={14} /> View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-[0.75rem] font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                    >
                      <TrashIcon size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="col-span-full text-center py-20 text-[#888]">No projects found.</p>}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove all associated contributors, endorsements, and collaboration requests.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </DashboardLayout>
  );
}
