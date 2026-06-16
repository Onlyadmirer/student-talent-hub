import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types/index.ts'
import { authApi } from '../services/api.ts'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<User>
  register: (data: Record<string, unknown>) => Promise<void>
  logout: () => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { access_token } = res.data
    localStorage.setItem('token', access_token)
    setToken(access_token)
    const me = await authApi.getMe()
    setUser(me.data)
    return me.data
  }

  const register = async (data: Record<string, unknown>) => {
    await authApi.register(data)
  }

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe()
      setUser(res.data)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
