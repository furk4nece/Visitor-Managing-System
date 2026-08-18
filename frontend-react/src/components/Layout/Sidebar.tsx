import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/visitors', label: 'Ziyaretçiler', roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'] },
  { to: '/personal', label: 'Personel', roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'] },
  { to: '/reports', label: 'Raporlar', roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'] },
  { to: '/users', label: 'Kullanıcılar', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/profile', label: 'Profilim', roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'] },
] as const

export function Sidebar() {
  const { user, hasRole, logout } = useAuth()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-4">
        <p className="text-sm font-semibold text-slate-800">VMS</p>
        <p className="text-xs text-slate-400">{user?.username}</p>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems
          .filter((item) => hasRole(...(item.roles as any)))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'block rounded-md px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
      <div className="border-t border-slate-100 p-2">
        <button
          onClick={logout}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
