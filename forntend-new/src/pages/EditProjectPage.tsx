import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { projectApi, userApi } from "../services/api.ts";
import type { Project } from "../types/index.ts";
import { PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [techStack, setTechStack] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  const [newCollabNim, setNewCollabNim] = useState("");
  const [newCollabRole, setNewCollabRole] = useState("");
  const [collabError, setCollabError] = useState("");
  const [collabSuccess, setCollabSuccess] = useState("");
  const [addingCollab, setAddingCollab] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    projectApi.getById(Number(id)).then((res) => {
      const p: Project = res.data;
      if (p.owner_id !== user.id) {
        navigate("/projects");
        return;
      }
      setTitle(p.title);
      setDescription(p.description);
      setGithubLink(p.github_link || "");
      setDemoLink(p.figma_link || "");
      setCoverImage(p.thumbnail_url || "");
      setTechStack("");
      setIsOpen(p.is_open);
      setStatus(p.status);
    }).catch(() => navigate("/projects"));
  }, [id, user]);

  const handleSave = async () => {
    if (!id || !title || !description) return;
    setSaving(true);
    try {
      await projectApi.update(Number(id), {
        title,
        description,
        github_link: githubLink || null,
        figma_link: demoLink || null,
        thumbnail_url: coverImage || null,
        is_open: isOpen,
        status,
      });
      navigate(`/projects/${id}`);
    } catch {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[950px] mx-auto w-full">
        <div
          onClick={() => navigate(`/projects/${id}`)}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-3.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to My Projects
        </div>

        <h1 className="font-heading text-[2.2rem] font-bold text-primary mb-7">
          Edit Project: {title || "..."}
        </h1>

        <div className="bg-white rounded-2xl p-10 mb-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-[1fr_1fr] gap-10 max-md:grid-cols-1">
            <div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Project Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none h-[110px] resize-y leading-relaxed"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">GitHub Repository Link</label>
                <input
                  type="text"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full p-3.5 pl-[45px] border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Demo / Figma Design Link</label>
                <input
                  type="text"
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">
                  Tech Stack <span className="font-normal text-[#888]">(pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Flutter, Node.js, Firebase"
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Cover Image URL</label>
                <img
                  src={coverImage || PLACEHOLDER_COVER}
                  alt="Cover Preview"
                  className="w-full h-[180px] rounded-lg border-2 border-dashed border-[#cbd5e1] object-cover mb-3"
                  onError={coverErrorHandler}
                />
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Recruitment Status</label>
                <select
                  value={isOpen ? "open" : "closed"}
                  onChange={(e) => setIsOpen(e.target.value === "open")}
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none bg-white"
                >
                  <option value="open">Open for Collaboration</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Visibility</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none bg-white"
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="bg-white rounded-2xl p-10 mb-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h2 className="font-heading text-[1.3rem] font-bold text-primary mb-6">Project Collaborators</h2>

          <table className="w-full border-collapse mb-7">
            <thead>
              <tr>
                <th className="text-left text-[0.7rem] font-bold text-[#888] pb-3.5 border-b border-[#eaeaea] uppercase tracking-wide">Name</th>
                <th className="text-left text-[0.7rem] font-bold text-[#888] pb-3.5 border-b border-[#eaeaea] uppercase tracking-wide">Role</th>
                <th className="text-left text-[0.7rem] font-bold text-[#888] pb-3.5 border-b border-[#eaeaea] uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3.5 border-b border-[#eaeaea]">
                  <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] rounded-full bg-[#a7f3d0] flex items-center justify-center text-[0.75rem] font-bold text-[#111]">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-[0.9rem]">{user?.name || "You"}</span>
                  </div>
                </td>
                <td className="py-3.5 border-b border-[#eaeaea] text-[0.9rem]">Owner</td>
                <td className="py-3.5 border-b border-[#eaeaea]">—</td>
              </tr>
            </tbody>
          </table>

          {collabSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-[0.85rem] flex items-center gap-2">
              <Check size={16} /> {collabSuccess}
            </div>
          )}
          {collabError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-[0.85rem]">{collabError}</div>
          )}
          <div className="flex gap-5 items-end max-md:flex-col">
            <div className="flex-1">
              <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Student NIM</label>
              <input
                type="text"
                value={newCollabNim}
                onChange={(e) => { setNewCollabNim(e.target.value); setCollabError(""); setCollabSuccess(""); }}
                placeholder="Enter NIM"
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[0.75rem] font-bold text-[#333] mb-2.5">Assign Role</label>
              <input
                type="text"
                value={newCollabRole}
                onChange={(e) => { setNewCollabRole(e.target.value); setCollabError(""); setCollabSuccess(""); }}
                placeholder="e.g. Frontend Developer"
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <button
              disabled={!newCollabNim || !newCollabRole || addingCollab}
              onClick={async () => {
                if (!id) return;
                setAddingCollab(true);
                setCollabError("");
                setCollabSuccess("");
                try {
                  const userRes = await userApi.getByNim(newCollabNim);
                  const userId = userRes.data.id;
                  await projectApi.addContributor({
                    user_id: userId,
                    project_id: Number(id),
                    role: newCollabRole,
                  });
                  setCollabSuccess(`Collaborator ${userRes.data.name} added successfully!`);
                  setNewCollabNim("");
                  setNewCollabRole("");
                } catch (err: any) {
                  setCollabError(err?.response?.data?.detail || "Failed to add collaborator. Check NIM.");
                } finally {
                  setAddingCollab(false);
                }
              }}
              className="bg-primary text-white border-none px-6 py-3.5 rounded-lg font-semibold flex items-center gap-2 h-[47px] cursor-pointer disabled:opacity-50"
            >
              <Plus size={18} /> {addingCollab ? "Adding..." : "Add Collaborator"}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3.5 mt-2.5 max-w-[950px]">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="bg-none border-none text-[#555] font-semibold text-[0.9rem] cursor-pointer px-3.5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title || !description || saving}
            className="bg-primary text-white border-none px-7 py-3.5 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
