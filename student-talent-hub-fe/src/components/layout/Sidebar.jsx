import { NavLink } from "react-router";

const linkGroups = [
  {
    label: "Main",
    links: [
      {
        name: "Dashboard",
        path: "/dashboard",
        roles: ["student", "recruiter", "admin"],
        icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
      },
      {
        name: "My Profile",
        path: "/profile",
        roles: ["student", "recruiter", "admin"],
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      },
    ],
  },
  {
    label: "Projects",
    links: [
      {
        name: "My Projects",
        path: "/projects",
        roles: ["student"],
        icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
      },
      {
        name: "Find Collaborators",
        path: "/collaborators",
        roles: ["student"],
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
        name: "Explore",
        path: "/explore",
        roles: ["student", "recruiter", "admin"],
        icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
      },
    ],
  },
  {
    label: "Admin",
    links: [
      {
        name: "Browse Projects",
        path: "/projects",
        roles: ["recruiter", "admin"],
        icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      },
      {
        name: "Master Data Skills",
        path: "/admin/skills",
        roles: ["admin"],
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
      },
      {
        name: "Users",
        path: "/admin/users",
        roles: ["admin"],
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      },
    ],
  },
];

export default function Sidebar({ user, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 lg:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-[#0a4b39] min-h-[calc(100vh-4rem)] flex flex-col fixed top-16 left-0 z-40 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className='flex-1 overflow-y-auto p-4'>
          {linkGroups.map((group) => {
            const filteredLinks = group.links.filter((l) =>
              l.roles.includes(user.role),
            );
            if (filteredLinks.length === 0) return null;

            return (
              <div key={group.label} className='mb-6'>
                <h3 className='text-xs font-bold text-slate-400 tracking-wider uppercase px-4 mb-2'>
                  {group.label}
                </h3>
                <div className='space-y-1'>
                  {filteredLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-white/10 font-semibold text-white"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <svg
                        className='w-5 h-5 shrink-0 opacity-80'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d={link.icon}
                        />
                      </svg>
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
