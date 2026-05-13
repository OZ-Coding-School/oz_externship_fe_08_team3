import { RouterProvider } from '@/providers/RouterProvider'
import { AuthBootstrap } from '@/providers/AuthBootstrap'

function App() {
  return (
    <AuthBootstrap>
      <RouterProvider />
    </AuthBootstrap>
  )
}

export default App
