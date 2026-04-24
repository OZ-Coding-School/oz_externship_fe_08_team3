import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import './App.css'
import App from './App'
import { useAuthStore } from './stores/authStore'

// Playwright E2E 테스트용 전역 노출 (DEV 전용)
if (import.meta.env.DEV) {
  Object.assign(window, { __authStore: useAuthStore })
}

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

enableMocking()
  .then(() => renderApp())
  .catch((error) => {
    console.error('MSW 초기화 실패:', error)
    renderApp()
  })
