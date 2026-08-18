import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/apiClient'
import { decodeToken, isTokenExpired, Role } from '../lib/auth'

interface AuthUser {
  id: number | null
  username: string
  roles: Role[]
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Svelte tarafındaki `stores/auth.js` store'unun React karşılığı.
// Token'ı localStorage'da tutar, sayfa yenilendiğinde otomatik geri yükler.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function hydrateFromToken(token: string | null) {
    if (!token) {
      setUser(null)
      return
    }
    const decoded = decodeToken(token)
    if (!decoded || isTokenExpired(decoded)) {
      localStorage.removeItem('vms_token')
      setUser(null)
      return
    }
    const username = decoded.upn ?? decoded.sub
    const roles = decoded.groups ?? []
    // Token'da kullanıcı id'si taşınmıyor (sadece username/roller var).
    // "Kendi hesabını yönetemez" gibi kontrollerin çalışabilmesi için
    // id'yi /users/me'den çekip tamamlıyoruz.
    setUser({ id: null, username, roles })
    try {
      const me = await api.get<{ id: number; username: string; role: string }>('/users/me')
      setUser({ id: me.data.id, username: me.data.username, roles: [me.data.role as Role] })
    } catch {
      // /users/me erişilemezse token'dan gelen bilgiyle devam edilir (id null kalır).
    }
  }

  useEffect(() => {
    hydrateFromToken(localStorage.getItem('vms_token')).finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password })
    const token: string = res.data.token
    localStorage.setItem('vms_token', token)
    await hydrateFromToken(token)
  }

  function logout() {
    localStorage.removeItem('vms_token')
    setUser(null)
  }

  function hasRole(...roles: Role[]) {
    if (!user) return false
    return roles.some((r) => user.roles.includes(r))
  }

  const value = useMemo(() => ({ user, loading, login, logout, hasRole }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
