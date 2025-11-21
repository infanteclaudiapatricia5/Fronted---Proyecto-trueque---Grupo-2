"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { apiFetch } from "@/lib/api-client"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  reputation: number
  joinedDate: string
  location?: string | null
  bio?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>
  signup: (email: string, password: string, name: string, recaptchaToken: string) => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "truequehub_user"
const TOKEN_KEY = "truequehub_token"
const avatarFromEmail = (email: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

interface ProfileResponse {
  id: string
  email: string
  name: string
  location?: string | null
  bio?: string | null
  reputationScore?: number
  tradesClosed?: number
  active?: boolean
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistSession = (tokenValue: string, profile: ProfileResponse) => {
    const hydratedUser: User = {
      id: profile.id,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      avatar: avatarFromEmail(profile.email),
      reputation: profile.reputationScore ?? 4.5,
      joinedDate: new Date().toISOString(),
      location: profile.location ?? null,
      bio: profile.bio ?? null,
    }

    setUser(hydratedUser)
    setToken(tokenValue)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hydratedUser))
    localStorage.setItem(TOKEN_KEY, tokenValue)
  }

  const logout = useCallback(() => {
    if (token) {
      apiFetch("/auth/logout", {
        method: "POST",
        token,
        skipJson: true,
      }).catch((error) => console.warn("logout error", error))
    }

    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }, [token])

  const refreshProfile = useCallback(async (tokenOverride?: string) => {
    const effectiveToken = tokenOverride || token
    if (!effectiveToken) {
      setIsLoading(false)
      return
    }

    try {
      const profile = await apiFetch<ProfileResponse>("/users/profile", {
        method: "GET",
        token: effectiveToken,
      })
      persistSession(effectiveToken, profile)
    } catch (error: any) {
      if (error?.status === 401) {
        console.warn("Token inválido o expirado, limpiando sesión")
      } else {
        console.error("Error fetching profile", error)
      }
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [token, logout])

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    if (storedToken) {
      setToken(storedToken)
      refreshProfile(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [refreshProfile])

  const login = async (email: string, password: string, recaptchaToken: string) => {
    const response = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password, recaptchaToken },
    })
    await refreshProfile(response.token)
  }

  const signup = async (email: string, password: string, name: string, recaptchaToken: string) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: {
        email,
        password,
        name,
        recaptchaToken,
      },
    })
  }

  const verifyEmail = async (email: string, code: string) => {
    await apiFetch("/auth/verify-email", {
      method: "POST",
      body: {
        email,
        code,
      },
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, verifyEmail, logout, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
