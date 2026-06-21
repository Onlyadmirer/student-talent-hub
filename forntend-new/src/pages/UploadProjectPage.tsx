import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, RocketLaunch } from "@phosphor-icons/react";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { projectApi } from "../services/api.ts";
import { PLACEHOLDER_COVER, coverErrorHandler } from "../types/index.ts";

export default function UploadProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [techStack, setTechStack] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGithubLink("");
    setDemoLink("");
    setCoverFile(null);
    setCoverPreview("");
    setTechStack("");
    setIsOpen(true);
    setError("");
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large. Max size: 5MB");
        e.target.value = "";
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) return;
    setSaving(true);
    setError("");
    try {
      const res = await projectApi.create({
        title,
        description,
        github_link: githubLink || null,
        figma_link: demoLink || null,
        thumbnail_url: null,
        is_open: isOpen,
      });
      const projectId = res.data.id;
      if (coverFile && projectId) {
        await projectApi.uploadThumbnail(projectId, coverFile);
      }
      resetForm();
      navigate("/projects", { state: { uploadSuccess: true } });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to publish project. Please try again.";
      setError(msg);
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px]">
        <div
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1.5 text-primary text-[0.85rem] font-semibold mb-5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to My Projects
        </div>

        <h1 className="font-heading text-[2.2rem] font-bold text-primary mb-1">
          Upload New Project
        </h1>
        <p className="text-[#555] text-[0.95rem] mb-10">
          Share your academic and professional milestones with the global student community.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[0.85rem]">{error}</div>
        )}

        <div className="grid grid-cols-[1fr_1fr] gap-10 max-md:grid-cols-1">
          <div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Project Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your project, the challenges you faced, and the results..."
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none h-[180px] resize-y"
              />
            </div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">GitHub Repository Link</label>
              <input
                type="text"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Demo / Figma Design Link</label>
              <input
                type="text"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                placeholder="https://figma.com/file/..."
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">
                Tech Stack <span className="text-[#888] font-normal">(pisahkan dengan koma)</span>
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
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Cover Image</label>
              <div className="border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#fafbfc] text-center p-5">
                <img
                  src={coverPreview || PLACEHOLDER_COVER}
                  alt="Cover Preview"
                  className="w-full h-[180px] rounded-lg object-cover mb-3"
                  onError={coverErrorHandler}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="w-full p-2.5 text-[0.8rem] outline-none file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[0.8rem] file:font-semibold file:bg-primary file:text-white cursor-pointer"
                />
                <p className="text-[0.7rem] text-[#555] font-medium mt-2">Recommended: 1200x630px, max 5MB</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Recruitment Status</label>
              <select
                value={isOpen ? "open" : "closed"}
                onChange={(e) => setIsOpen(e.target.value === "open")}
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none bg-white"
              >
                <option value="open">Open for Collaboration</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="bg-[#e0fdf4] rounded-lg p-5 border border-[#ccfbf1] mt-2.5">
              <div className="flex items-center gap-2 text-primary font-semibold text-[0.85rem] mb-2">
                <Info size={18} /> Pro Tip
              </div>
              <p className="text-[0.75rem] text-primary font-semibold leading-relaxed">
                Adding clear documentation and design links increases project visibility by up to 40% among recruiters.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-7 max-w-[1000px]">
          <button
            onClick={handleSubmit}
            disabled={!title || !description || saving}
            className="bg-primary text-white border-none px-7 py-3.5 rounded-lg font-semibold text-base flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RocketLaunch size={20} /> {saving ? "Publishing..." : "Publish Project"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
