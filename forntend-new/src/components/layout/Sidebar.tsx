import { SquaresFourIcon, UserIcon, FolderSimpleIcon, CompassIcon, HandshakeIcon, ShieldIcon, BookmarkIcon, SignOutIcon } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'
  const isRecruiter = user?.role === 'recruiter'

  const menuItems = isAdmin
    ? [
        { label: 'Admin Panel', icon: ShieldIcon, path: '/admin' },
        { label: 'My Profile', icon: UserIcon, path: '/profile' },
      ]
    : isRecruiter
    ? [
        { label: 'Dashboard', icon: SquaresFourIcon, path: '/recruiter/dashboard' },
        { label: 'My Profile', icon: UserIcon, path: '/profile' },
        { label: 'Explore', icon: CompassIcon, path: '/explore' },
        { label: 'Saved Students', icon: BookmarkIcon, path: '/recruiter/saved' },
      ]
    : [
        { label: 'Dashboard', icon: SquaresFourIcon, path: '/dashboard' },
        { label: 'My Profile', icon: UserIcon, path: '/profile' },
        ...(isStudent
          ? [
              { label: 'My Projects', icon: FolderSimpleIcon, path: '/projects' },
              { label: 'My Requests', icon: HandshakeIcon, path: '/my-requests' },
            ]
          : []),
        { label: 'Explore', icon: CompassIcon, path: '/explore' },
      ]

  const isActivePath = (path: string) => {
    if (path === '/profile') return location.pathname.startsWith('/profile')
    if (path === '/projects') return location.pathname === '/projects'
    if (path === '/admin') return location.pathname.startsWith('/admin')
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
        <SignOutIcon size={20} className="mr-[15px]" />
        Sign Out
      </div>
    </aside>
  )
}
