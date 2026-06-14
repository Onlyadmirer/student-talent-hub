import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "My Projects",
      path: "/projects",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    {
      name: "Explore",
      path: "/explore",
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    },
  ];

  return (
    <aside className='w-64 bg-[#0a4b39] min-h-[calc(100vh-4rem)] flex flex-col fixed text-white'>
      <div className='p-6'>
        <h2 className='text-sm font-bold text-slate-300 tracking-wider uppercase mb-6'>
          Project Hub
        </h2>
        <nav className='space-y-2'>
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 font-semibold text-white border-l-4 border-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <svg
                className='w-5 h-5 opacity-80'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d={menu.icon}
                ></path>
              </svg>
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
