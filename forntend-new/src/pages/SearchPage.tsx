import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";
import { searchApi } from "../services/api.ts";
import { PLACEHOLDER_COVER, PLACEHOLDER_AVATAR, coverErrorHandler } from "../types/index.ts";
import type { SearchResponse } from "../types/index.ts";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResponse | null>(null);

  useEffect(() => {
    if (!q.trim()) return;
    searchApi.all(q.trim()).then((res) => setResults(res.data)).catch(() => {});
  }, [q]);

  const users = results?.users ?? [];
  const projects = results?.projects ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-[2rem] font-bold text-primary mb-2">Search Results</h1>
          <p className="text-[#555] text-[0.95rem]">
            {q ? `Showing results for "${q}"` : "Enter a search term to find users and projects"}
          </p>
        </div>

        {users.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[1.2rem] font-bold text-primary mb-4">Users ({users.length})</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => navigate(`/students/${u.id}`)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-[#f0f0f0] flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                >
                  <img
                    src={PLACEHOLDER_AVATAR}
                    alt={u.name}
                    className="w-[80px] h-[80px] rounded-full object-cover mb-4"
                  />
                  <h3 className="text-[1.1rem] font-bold text-primary mb-1">{u.name}</h3>
                  <p className="text-[0.8rem] text-[#555]">{u.major || u.nim || "—"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[1.2rem] font-bold text-primary mb-4">Projects ({projects.length})</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                >
                  <div className="relative w-full h-[160px]">
                    <img
                      src={p.thumbnail_url || PLACEHOLDER_COVER}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      onError={coverErrorHandler}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[1.15rem] font-bold text-primary mb-2">{p.title}</h3>
                    <p className="text-[0.8rem] text-[#555] leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-2 pt-3.5 border-t border-[#f3f4f6]">
                      <img
                        src={PLACEHOLDER_AVATAR}
                        className="w-[24px] h-[24px] rounded-full object-cover"
                        alt=""
                      />
                      <span className="text-[0.8rem] font-semibold text-[#111]">{p.owner_name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {q && users.length === 0 && projects.length === 0 && (
          <p className="text-center text-[#888] py-10">No results found for "{q}".</p>
        )}
      </div>
    </DashboardLayout>
  );
}
