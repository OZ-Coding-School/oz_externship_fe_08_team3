export interface MeResponse {
  id: number
  nickname: string
  email: string
  profile_img_url: string | null
  role: 'USER' | 'STUDENT' | 'TA' | 'OM' | 'LC' | 'ADMIN'
}
