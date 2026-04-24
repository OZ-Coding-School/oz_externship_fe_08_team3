import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// swagger RoleF6eEnum 기준
export type UserRole = 'USER' | 'STUDENT' | 'TA' | 'OM' | 'LC' | 'ADMIN'

// 답변 작성/수정 허용 role (USER 제외)
export const ANSWER_ALLOWED_ROLES: UserRole[] = [
  'STUDENT',
  'TA',
  'OM',
  'LC',
  'ADMIN',
]

interface User {
  id?: number
  nickname: string
  email: string
  profileImage?: string | null
  role?: UserRole
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) =>
        set({ isAuthenticated: true, user }, undefined, 'auth/login'),
      logout: () =>
        set({ isAuthenticated: false, user: null }, undefined, 'auth/logout'),
    }),
    { name: 'AuthStore' }
  )
)
