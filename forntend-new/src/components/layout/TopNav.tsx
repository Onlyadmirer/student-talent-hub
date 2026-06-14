import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlass, Gear } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'
import { PLACEHOLDER_AVATAR, imgErrorHandler } from '../../types/index.ts'
import { searchApi } from '../../services/api.ts'
import type { SearchResponse, SearchUserResult, SearchProjectResult } from '../../types/index.ts'

export default function TopNav() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()
    if (!trimmed) {
      setResults(null)
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchApi.all(trimmed)
        setResults(res.data)
        setIsOpen(true)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(path: string) {
    setIsOpen(false)
    setQuery('')
    setResults(null)
    navigate(path)
  }

  const hasUsers = results && results.users.length > 0
  const hasProjects = results && results.projects.length > 0

  return (
    <nav className="bg-white flex w-full items-center justify-between px-10 max-md:px-5 h-[70px] border-b border-[#eaeaea]">
      <div className="font-heading text-[1.3rem] font-bold text-primary w-[215px]">
        Student Talent Hub
      </div>
      <div className="flex-1 max-w-[500px] relative ml-5 max-md:hidden" ref={dropdownRef}>
        <MagnifyingGlass size={18} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#888]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users or projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results) setIsOpen(true) }}
          className="w-full py-2.5 px-4 pl-10 border-none rounded-lg bg-[#f3f4f6] text-sm text-[#333] outline-none placeholder:text-[#6B7280]"
        />

        {isOpen && (hasUsers || hasProjects) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-[#f0f0f0] z-50 max-h-[70vh] overflow-y-auto">
            {hasUsers && (
              <div className="p-3">
                <p className="text-[0.65rem] font-bold text-[#888] uppercase tracking-wider px-3 mb-1">Users</p>
                {results.users.map((u: SearchUserResult) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelect(`/students/${u.id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f3f4f6] transition-colors"
                  >
                    <img
                      src={PLACEHOLDER_AVATAR}
                      className="w-[32px] h-[32px] rounded-full object-cover"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.85rem] font-semibold text-[#111] truncate">{u.name}</p>
                      <p className="text-[0.7rem] text-[#888] truncate">{u.major || u.nim || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasProjects && (
              <div className="p-3 pt-0">
                <p className="text-[0.65rem] font-bold text-[#888] uppercase tracking-wider px-3 mb-1">Projects</p>
                {results.projects.map((p: SearchProjectResult) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f3f4f6] transition-colors"
                  >
                    <div className="w-[32px] h-[32px] rounded-lg bg-[#e5e7eb] flex-shrink-0 overflow-hidden">
                      {p.thumbnail_url && (
                        <img src={p.thumbnail_url} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.85rem] font-semibold text-[#111] truncate">{p.title}</p>
                      <p className="text-[0.7rem] text-[#888] truncate">{p.owner_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => handleSelect(`/search?q=${encodeURIComponent(query.trim())}`)}
              className="border-t border-[#f0f0f0] p-3 text-center text-[0.8rem] font-semibold text-primary cursor-pointer hover:bg-[#f9fafb] rounded-b-xl transition-colors"
            >
              View all results
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute right-[15px] top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-5">
        <Gear size={22} className="text-[#555] cursor-pointer" />
        <img
          src={user?.profile_picture || PLACEHOLDER_AVATAR}
          alt="Profile"
          className="w-[35px] h-[35px] rounded-full object-cover cursor-pointer"
          onClick={() => navigate('/profile')}
          onError={imgErrorHandler}
        />
      </div>
    </nav>
  )
}
