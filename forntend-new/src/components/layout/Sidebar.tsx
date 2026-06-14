import { SquaresFour, User, FolderSimple, Compass, SignOut } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { label: 'Dashboard', icon: SquaresFour, path: '/dashboard' },
    { label: 'My Profile', icon: User, path: '/profile' },
    ...(user?.role === 'student'
      ? [{ label: 'My Projects', icon: FolderSimple, path: '/projects' }]
      : []),
    { label: 'Explore', icon: Compass, path: '/explore' },
  ]

  const isActivePath = (path: string) => {
    if (path === '/profile') return location.pathname.startsWith('/profile')
    if (path === '/projects') return location.pathname === '/projects'
    return location.pathname === path
  }

  return (
    <aside className="bg-sidebar text-white pt-8 col-start-1 row-start-2 flex flex-col max-md:hidden">
      <h2 className="font-heading text-lg font-bold mb-5 px-[25px]">Project Hub</h2>
      <ul className="list-none flex-1">
        {menuItems.map((item) => {
          const isActive = isActivePath(item.path)
          return (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-[25px] py-3 text-sm font-medium cursor-pointer transition-all duration-200
                ${isActive
                  ? 'bg-white/10 text-white border-l-4 border-white pl-[21px]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} className="mr-[15px]" />
              {item.label}
            </li>
          )
        })}
      </ul>
      <div
        onClick={logout}
        className="flex items-center px-[25px] py-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
      >
        <SignOut size={20} className="mr-[15px]" />
        Sign Out
      </div>
    </aside>
  )
}
