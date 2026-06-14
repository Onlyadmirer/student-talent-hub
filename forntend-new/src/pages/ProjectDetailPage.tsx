import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PencilSimple, Trash, UserPlus, Code, Palette, Star } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { projectApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";
import ConfirmModal from "../components/ui/ConfirmModal.tsx";
import type { ContributorWithUser } from "../types/index.ts";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [contributors, setContributors] = useState<ContributorWithUser[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    projectApi.getById(Number(id)).then((res) => {
      setProject(res.data);
      projectApi.getContributors(Number(id)).then((r) => setContributors(r.data)).catch(() => {});
    }).catch(() => navigate("/projects"));
  }, [id]);

  if (!project) return <DashboardLayout><div className="flex justify-center py-20 text-[#888]">Loading...</div></DashboardLayout>;

  const isOwner = user?.id === project.owner_id;
  const techStack = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()) : [];
  const ownerName = project.owner_name || user?.name || "User";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectApi.delete(Number(id));
      navigate("/projects");
    } catch {
      setDeleting(false);
      alert("Failed to delete project.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto w-full">
        <div
          onClick={() => navigate(isOwner ? "/projects" : "/explore")}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-3.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to {isOwner ? "My Projects" : "Explore"}
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-[2.5rem] font-bold text-primary mb-3.5">{project.title}</h1>
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => navigate(isOwner ? "/profile" : `/students/${project.owner_id}`)}
                className="flex items-center gap-2 text-[0.85rem] font-semibold text-[#555] cursor-pointer hover:text-primary transition-colors"
              >
                <img
                  src={PLACEHOLDER_AVATAR}
                  className="rounded-full w-[25px] h-[25px] object-cover"
                  alt=""
                />
                By {ownerName}
              </div>
              <span className="px-3 py-1 rounded-full text-[0.7rem] font-bold bg-[#a7f3d0] text-[#047857]">
                RECRUITMENT: {project.is_open ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>
          {isOwner ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-white text-red-600 border border-red-300 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer hover:bg-red-50 transition-colors"
              >
                <Trash size={18} /> Delete
              </button>
              <button
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
              >
                <PencilSimple size={18} /> Edit Project
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/students/${project.owner_id}`)}
              className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
            >
              <UserPlus size={18} /> Contact Owner via Profile
            </button>
          )}
        </div>

        <img
          src={project.thumbnail_url || PLACEHOLDER_COVER}
          alt={project.title}
          className="w-full h-[400px] rounded-2xl object-cover mb-7 shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
          onError={coverErrorHandler}
        />

        <div className="grid grid-cols-[2fr_1fr] gap-7 mb-10 max-md:grid-cols-1">
          <div className="bg-white rounded-2xl p-[35px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-[1.2rem] font-bold text-primary mb-5">About Project</h2>
            <p className="text-[#4b5563] leading-relaxed text-[0.95rem] mb-7">{project.description}</p>

            {techStack.length > 0 && (
              <>
                <h3 className="text-[0.7rem] font-bold text-[#888] uppercase tracking-wide mb-3.5">Tech Stack</h3>
                <div className="flex gap-2.5 flex-wrap">
                  {techStack.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-[0.75rem] font-semibold text-[#111] bg-white border border-[#eaeaea]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6">
              <h3 className="text-[0.7rem] font-bold text-[#888] uppercase tracking-wide mb-3.5">Project Links</h3>
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 border border-[#eaeaea] rounded-lg text-[0.85rem] font-semibold text-[#333] mb-2.5 bg-white hover:bg-[#f8fafc] no-underline"
                >
                  <Code size={20} className="text-primary" /> View GitHub
                </a>
              )}
              {project.figma_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 border border-[#eaeaea] rounded-lg text-[0.85rem] font-semibold text-[#333] mb-2.5 bg-white hover:bg-[#f8fafc] no-underline"
                >
                  <Palette size={20} className="text-primary" /> View Figma
                </a>
              )}
              <div
                onClick={() => navigate(`/projects/${id}/endorsements`)}
                className="flex items-center gap-3.5 p-3.5 border border-[#eaeaea] rounded-lg text-[0.85rem] font-semibold text-[#333] bg-white hover:bg-[#f8fafc] cursor-pointer"
              >
                <Star size={20} className="text-primary" /> View Endorsements
              </div>
              {!project.github_link && !project.demo_link && (
                <p className="text-[#888] text-sm">No links added yet.</p>
              )}
            </div>

            {contributors.length > 0 && (
              <div className="bg-white rounded-2xl p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h3 className="text-[0.7rem] font-bold text-[#888] uppercase tracking-wide mb-3.5">Project Team</h3>
                {contributors.map((c) => (
                  <div key={c.id} className="flex items-center gap-3.5 mb-4 last:mb-0">
                    <img
                      src={PLACEHOLDER_AVATAR}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                      alt=""
                    />
                    <div>
                      <h4 className="text-[0.9rem] font-semibold text-[#111]">{c.user_name || `User #${c.user_id}`}</h4>
                      <p className="text-[0.75rem] text-[#666]">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone. All associated data including contributors and endorsements will be permanently removed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      </div>
    </DashboardLayout>
  );
}
