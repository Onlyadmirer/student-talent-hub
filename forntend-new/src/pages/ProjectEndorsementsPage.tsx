import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PaperPlaneRight, SealCheck } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { endorsementApi, projectApi } from "../services/api.ts";
import { PLACEHOLDER_AVATAR, imgErrorHandler } from "../types/index.ts";
import type { EndorsementWithUser, ContributorWithUser } from "../types/index.ts";

export default function ProjectEndorsementsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [endorsements, setEndorsements] = useState<EndorsementWithUser[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectOwnerId, setProjectOwnerId] = useState<number | null>(null);
  const [contributors, setContributors] = useState<ContributorWithUser[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    projectApi.getById(Number(id)).then((res) => {
      setProjectTitle(res.data.title);
      setProjectOwnerId(res.data.owner_id);
    }).catch(() => {});
    endorsementApi.getByProject(Number(id)).then((res) => setEndorsements(res.data)).catch(() => {});
    projectApi.getContributors(Number(id)).then((res) => setContributors(res.data)).catch(() => {});
  }, [id]);

  const isOwnerOrCollaborator = user && (user.id === projectOwnerId || contributors.some((c) => c.user_id === user.id));

  const handleSubmit = async () => {
    if (!message.trim() || !id || !user) return;
    setSending(true);
    try {
      await endorsementApi.create({
        to_user_id: projectOwnerId || 0,
        skill_id: null,
        project_id: Number(id),
        message: message.trim(),
      });
      setMessage("");
      endorsementApi.getByProject(Number(id)).then((res) => setEndorsements(res.data));
    } catch {}
    setSending(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1050px] mx-auto w-full">
        <div
          onClick={() => navigate(`/projects/${id}`)}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Project
        </div>

        <div className="mb-8">
          <h1 className="text-[2.2rem] font-bold text-primary mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Project Endorsements
          </h1>
          <p className="text-[#555] text-[0.95rem]">
            Peer validation and professional testimonials for {projectTitle || "this initiative"}.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_1.8fr] gap-10 max-md:grid-cols-1">
          {!isOwnerOrCollaborator && (
            <div className="bg-white rounded-xl p-8 shadow-sm border-t-4 border-t-primary h-fit">
              <h2 className="text-[1.5rem] font-bold text-primary mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Give Appreciation for this Project
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a testimonial or feedback about this project..."
                className="w-full p-4 border-none rounded-lg text-[0.9rem] bg-[#f3f4f6] outline-none h-[140px] resize-none mb-3.5"
              />
              <span className="text-[0.75rem] text-[#888] italic block mb-5">
                Your endorsement will appear on the owner's profile
              </span>
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="w-full bg-primary text-white border-none p-3.5 rounded-lg font-semibold text-[0.9rem] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                Submit Endorsement <PaperPlaneRight size={18} />
              </button>
            </div>
          )}

          <div className={isOwnerOrCollaborator ? "col-span-full" : ""}>
            <div className="flex items-center gap-3 mb-8">
              <SealCheck size={28} className="text-primary" />
              <span className="bg-[#a7f3d0] text-[#047857] px-3 py-1.5 rounded-full text-[0.75rem] font-bold">
                {endorsements.length} Testimonial{endorsements.length !== 1 ? "s" : ""}
              </span>
            </div>

            {endorsements.map((e) => (
              <div key={e.id} className="bg-white rounded-xl p-6 mb-5 shadow-sm flex gap-5">
                <img
                  src={e.from_user_profile_picture || PLACEHOLDER_AVATAR}
                  className="w-[45px] h-[45px] rounded-full object-cover flex-shrink-0"
                  alt=""
                  onError={imgErrorHandler}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[0.95rem] font-semibold text-[#111]">{e.from_user_name || `User #${e.from_user_id}`}</h4>
                      <p className="text-[0.75rem] font-bold text-[#0d9488]">Supporter</p>
                    </div>
                    <span className="text-[0.75rem] text-[#888]">
                      {e.created_at ? new Date(e.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-[0.9rem] text-[#555] leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    &ldquo;{e.message}&rdquo;
                  </p>
                </div>
              </div>
            ))}

            {endorsements.length === 0 && (
              <p className="text-[#888] text-sm">No endorsements yet for this project.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
