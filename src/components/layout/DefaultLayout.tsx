import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
