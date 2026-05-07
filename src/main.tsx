import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import './App.css'
import App from './App'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryProvider>
          <App />
        </QueryProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

// DEV: 콘솔에서 devLogin()으로 즉시 로그인
if (import.meta.env.DEV) {
  import('./stores/authStore').then(({ useAuthStore }) => {
    ;(window as unknown as Record<string, unknown>).devLogin = () => {
      localStorage.setItem('accessToken', 'dev-mock-token')
      useAuthStore.getState().login({ nickname: 'dev', email: 'dev@test.com' })
      console.log('로그인 완료')
    }
  })
}

// MSW 초기화 완료 후 렌더링 — 모킹 없이 API 호출되면 Vite가 HTML을 반환하여 크래시됨
enableMocking()
  .catch((error) => {
    console.error('MSW 초기화 실패:', error)
  })
  .finally(() => {
    renderApp()
  })
