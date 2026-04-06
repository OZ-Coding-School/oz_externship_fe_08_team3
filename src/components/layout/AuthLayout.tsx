import { Outlet } from 'react-router'
import { Header } from './Header'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
    </div>
  )
}
