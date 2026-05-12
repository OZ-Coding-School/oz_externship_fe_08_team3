import type { UserRole } from '@/stores/authStore'

// 답변 작성/수정 허용 role (USER 제외)
export const ANSWER_ALLOWED_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  'STUDENT',
  'TA',
  'OM',
  'LC',
  'ADMIN',
])
