import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatbotFab } from '@/components/chatbot'

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
      <ChatbotFab />
    </div>
  )
}
