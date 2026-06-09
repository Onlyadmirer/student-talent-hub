import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

// Dummy user state for Phase 1 - to be replaced with actual auth context in Phase 2
const DUMMY_USER = {
  name: "John Doe",
  role: "student", // change to 'admin' or 'recruiter' to see different links
  email: "john@example.com",
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Using dummy user for the UI shell.
  const [user] = useState(DUMMY_USER);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Phase 2: clear localStorage and redirect
    console.log("Logging out...");
    navigate("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      roles: ["student", "recruiter", "admin"],
    },
    { name: "My Projects", path: "/projects", roles: ["student"] },
    { name: "Find Collaborators", path: "/collaborators", roles: ["student"] },
    {
      name: "Browse Projects",
      path: "/projects",
      roles: ["recruiter", "admin"],
    },
    { name: "Master Data Skills", path: "/admin/skills", roles: ["admin"] },
    { name: "Users", path: "/admin/users", roles: ["admin"] },
  ];

  const filteredLinks = navLinks.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='flex items-center justify-center h-16 border-b border-gray-200 px-4 shrink-0'>
          <span className='text-xl font-bold text-blue-600 truncate'>
            Talent Hub
          </span>
        </div>
        <nav className='p-4 flex-1 overflow-y-auto space-y-1'>
          {filteredLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className='flex flex-col flex-1 min-w-0 overflow-hidden'>
        {/* Top Header */}
        <header className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8 shrink-0'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='p-2 mr-4 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </button>
            <h1 className='text-xl font-semibold text-gray-800 truncate hidden sm:block'>
              Dashboard
            </h1>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='text-sm text-right hidden sm:block'>
              <p className='font-medium text-gray-900'>{user.name}</p>
              <p className='text-gray-500 capitalize'>{user.role}</p>
            </div>
            <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase shrink-0'>
              {user.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className='ml-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500'
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className='flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
