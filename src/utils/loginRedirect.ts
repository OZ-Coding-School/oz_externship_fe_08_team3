import { EXTERNAL_URLS } from '@/constants/routes'

export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL ?? EXTERNAL_URLS.LOGIN

export function redirectToLogin() {
  window.location.assign(LOGIN_URL)
}
