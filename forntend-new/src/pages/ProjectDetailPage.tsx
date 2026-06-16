import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PencilSimple, Trash, UserPlus, Code, Palette, Star, Handshake, Check, X, PaperPlaneRight, Clock } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { projectApi, requestApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";
import ConfirmModal from "../components/ui/ConfirmModal.tsx";
import type { ContributorWithUser, CollaborationRequest } from "../types/index.ts";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [contributors, setContributors] = useState<ContributorWithUser[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqRole, setReqRole] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [sendingReq, setSendingReq] = useState(false);

  const [myRequest, setMyRequest] = useState<CollaborationRequest | null>(null);

  const [incomingRequests, setIncomingRequests] = useState<CollaborationRequest[]>([]);
  const [showRequestsTab, setShowRequestsTab] = useState(false);
  const [processingReqId, setProcessingReqId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    projectApi.getById(Number(id)).then((res) => {
      setProject(res.data);
      projectApi.getContributors(Number(id)).then((r) => setContributors(r.data)).catch(() => {});
    }).catch(() => navigate("/projects"));
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    requestApi.getMyRequests().then((res) => {
      const found = res.data.find((r: CollaborationRequest) => r.project_id === Number(id) && r.status === "pending");
      if (found) setMyRequest(found);
    }).catch(() => {});
  }, [id, user]);

  if (!project) return <DashboardLayout><div className="flex justify-center py-20 text-[#888]">Loading...</div></DashboardLayout>;

  const isOwner = user?.id === project.owner_id;
  const isContributor = user ? (project.contributors || []).some((c: any) => c.user_id === user.id) : false;
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

  const handleSendRequest = async () => {
    if (!reqRole) return;
    setSendingReq(true);
    try {
      const res = await requestApi.sendRequest(Number(id), { role: reqRole, message: reqMessage || undefined });
      setMyRequest(res.data);
      setShowRequestModal(false);
      setReqRole("");
      setReqMessage("");
    } catch {
      alert("Failed to send request.");
    } finally {
      setSendingReq(false);
    }
  };

  const loadIncomingRequests = async () => {
    try {
      const res = await requestApi.getProjectRequests(Number(id));
      setIncomingRequests(res.data);
      setShowRequestsTab(true);
    } catch {
      alert("Failed to load requests.");
    }
  };

  const handleRequestAction = async (reqId: number, status: string) => {
    setProcessingReqId(reqId);
    try {
      await requestApi.updateRequest(Number(id), reqId, status);
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: status as "accepted" | "rejected" } : r))
      );
      if (status === "accepted") {
        projectApi.getContributors(Number(id)).then((r) => setContributors(r.data)).catch(() => {});
      }
    } catch {
      alert("Failed to update request.");
    } finally {
      setProcessingReqId(null);
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
            <div className="flex gap-3">
              {myRequest ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[0.85rem] font-semibold">
                  <Clock size={18} /> Request Pending ({myRequest.role})
                </div>
              ) : user?.role === "student" && project.is_open && !isContributor ? (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Handshake size={18} /> Request to Collaborate
                </button>
              ) : null}
              <button
                onClick={() => navigate(`/students/${project.owner_id}`)}
                className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
              >
                <UserPlus size={18} /> Contact Owner
              </button>
            </div>
          )}
        </div>

        <img
          src={project.thumbnail_url || PLACEHOLDER_COVER}
          alt={project.title}
          className="w-full h-[400px] rounded-2xl object-cover mb-7 shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
          onError={coverErrorHandler}
        />

        <div className="flex gap-4 mb-7">
          <div
            onClick={() => setShowRequestsTab(false)}
            className={`px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-colors ${
              !showRequestsTab ? "bg-primary text-white" : "bg-white text-[#555] border border-[#eaeaea]"
            }`}
          >
            About Project
          </div>
          {isOwner && (
            <div
              onClick={loadIncomingRequests}
              className={`px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
                showRequestsTab ? "bg-primary text-white" : "bg-white text-[#555] border border-[#eaeaea]"
              }`}
            >
              <Handshake size={16} /> Requests ({incomingRequests.filter((r) => r.status === "pending").length})
            </div>
          )}
        </div>

        {showRequestsTab && isOwner ? (
          <div className="bg-white rounded-2xl p-[35px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-10">
            <h2 className="text-[1.2rem] font-bold text-primary mb-5">Collaboration Requests</h2>
            {incomingRequests.length === 0 ? (
              <p className="text-[#888]">No requests yet.</p>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border border-[#eaeaea] rounded-xl p-5 flex items-start justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <img src={PLACEHOLDER_AVATAR} className="w-[44px] h-[44px] rounded-full object-cover" alt="" />
                      <div>
                        <h4 className="text-[0.95rem] font-semibold text-[#111]">{req.requester_name}</h4>
                        <p className="text-[0.75rem] text-[#666]">{req.requester_nim}</p>
                        <p className="text-[0.85rem] text-primary font-semibold mt-1.5">Wants to join as: {req.role}</p>
                        {req.message && (
                          <p className="text-[0.8rem] text-[#555] mt-1 italic">"{req.message}"</p>
                        )}
                        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                          req.status === "pending" ? "bg-amber-50 text-amber-700" :
                          req.status === "accepted" ? "bg-green-50 text-green-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {req.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleRequestAction(req.id, "accepted")}
                          disabled={processingReqId === req.id}
                          className="bg-green-600 text-white border-none px-4 py-2 rounded-lg text-[0.8rem] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, "rejected")}
                          disabled={processingReqId === req.id}
                          className="bg-red-500 text-white border-none px-4 py-2 rounded-lg text-[0.8rem] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
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

              <div className="bg-white rounded-2xl p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h3 className="text-[0.7rem] font-bold text-[#888] uppercase tracking-wide mb-3.5">Project Team</h3>
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={PLACEHOLDER_AVATAR}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <h4 className="text-[0.9rem] font-semibold text-[#111]">{project.owner_name || "Owner"}</h4>
                    <p className="text-[0.75rem] text-[#666]">Owner</p>
                  </div>
                </div>
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
            </div>
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
              <h2 className="text-[1.3rem] font-bold text-primary mb-6">Request to Collaborate</h2>
              <div className="mb-5">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Role you want to take</label>
                <input
                  type="text"
                  value={reqRole}
                  onChange={(e) => setReqRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, UI Designer"
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Message to owner <span className="font-normal text-[#888]">(optional)</span></label>
                <textarea
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  placeholder="Tell the owner why you want to join..."
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none h-[90px] resize-y leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="bg-none border-none text-[#555] font-semibold text-[0.9rem] cursor-pointer px-3.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!reqRole || sendingReq}
                  className="bg-primary text-white border-none px-6 py-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <PaperPlaneRight size={16} /> {sendingReq ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        )}

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
