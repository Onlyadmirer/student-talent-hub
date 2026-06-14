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
  const [coverImage, setCoverImage] = useState("");
  const [techStack, setTechStack] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) return;
    setSaving(true);
    try {
      await projectApi.create({
        title,
        description,
        github_link: githubLink || null,
        figma_link: demoLink || null,
        thumbnail_url: coverImage || null,
        is_open: isOpen,
      });
      navigate("/projects");
    } catch {
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
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Cover Image URL</label>
              <div className="border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#fafbfc] text-center p-5">
                <img
                  src={coverImage || PLACEHOLDER_COVER}
                  alt="Cover Preview"
                  className="w-full h-[180px] rounded-lg object-cover mb-3"
                  onError={coverErrorHandler}
                />
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2.5 border border-[#eaeaea] rounded-lg text-[0.8rem] outline-none"
                />
                <p className="text-[0.7rem] text-[#555] font-medium mt-2">Recommended: 1200x630px, URL format</p>
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
            <div className="mb-6">
              <label className="block text-[0.8rem] font-semibold text-[#333] mb-2.5">Visibility</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3.5 border border-[#eaeaea] rounded-lg text-[0.9rem] outline-none bg-white"
              >
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
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
