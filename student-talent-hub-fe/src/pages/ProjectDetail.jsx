import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { api } from "../services/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.fetchWithAuth(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#0a4b39] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-lg mb-4">{error || "Project not found"}</p>
        <button
          onClick={() => navigate("/projects")}
          className="text-[#0a4b39] font-medium hover:underline"
        >
          Back to My Projects
        </button>
      </div>
    );
  }

  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner_name)}&background=0a4b39&color=fff`;

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans">
      {/* Back Link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#0a4b39] hover:text-[#083a2c] transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to My Projects
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0a4b39] tracking-tight mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            {/* Author Info */}
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <img src={authorAvatar} alt="Author" className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium text-slate-600">
                By {project.owner_name}
              </span>
            </div>
            {/* Badges */}
            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#e6fcf5] text-[#0a4b39] uppercase tracking-wider">
              Status: {project.status}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#e6fcf5] text-[#0a4b39] uppercase tracking-wider">
              Recruitment: {project.is_open ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/projects/${id}/edit`}
          className="inline-flex items-center justify-center gap-2 bg-[#0a4b39] hover:bg-[#083a2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Project
        </Link>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[400px] bg-slate-200 rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-100">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt="Project Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column: About Project */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
          <h2 className="text-xl font-bold text-[#0a4b39] mb-6">About Project</h2>
          <div className="text-slate-600 text-sm leading-loose whitespace-pre-line mb-8">
            {project.description}
          </div>
        </div>

        {/* Right Column: Links & Team */}
        <div className="space-y-6">
          {/* Project Links */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Project Links</h3>
            <div className="space-y-3">
              {project.github_link ? (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-[#0a4b39] hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-semibold text-[#0a4b39]">
                    View GitHub
                    <br />
                    <span className="text-xs text-slate-500 font-normal">Repository</span>
                  </span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-[#0a4b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="p-3 border border-slate-200 rounded-xl text-sm text-slate-400 text-center">
                  No GitHub link
                </div>
              )}
              {project.figma_link ? (
                <a
                  href={project.figma_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-[#0a4b39] hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-semibold text-[#0a4b39]">View Figma Design</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-[#0a4b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </a>
              ) : (
                <div className="p-3 border border-slate-200 rounded-xl text-sm text-slate-400 text-center">
                  No Figma link
                </div>
              )}
            </div>
          </div>

          {/* Project Team */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Project Team</h3>
            <div className="space-y-5">
              {/* Owner */}
              <div className="flex items-center gap-3">
                <img src={authorAvatar} alt={project.owner_name} className="w-10 h-10 rounded-full border border-slate-200" />
                <div>
                  <h4 className="text-sm font-bold text-[#0a4b39]">{project.owner_name}</h4>
                  <p className="text-xs text-slate-500">Project Owner</p>
                </div>
              </div>
              {/* Contributors */}
              {project.contributors?.length > 0 ? (
                project.contributors.map((member) => {
                  const memberAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user_name)}&background=f1f5f9&color=64748b`;
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <img src={memberAvatar} alt={member.user_name} className="w-10 h-10 rounded-full border border-slate-200" />
                      <div>
                        <h4 className="text-sm font-bold text-[#0a4b39]">{member.user_name}</h4>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No contributors yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
