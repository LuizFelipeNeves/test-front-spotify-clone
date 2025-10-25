import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/pages/LoginPage'
import CallbackPage from '@/pages/CallbackPage'
import HomePage from '@/pages/HomePage'
import { ArtistsPage } from '@/pages/ArtistsPage'
import { ROUTES } from '@/utils/constants'
import './App.css'

// Componente para proteger rotas autenticadas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  
  return <>{children}</>
}



function App() {
  const { isAuthenticated } = useAuthStore()

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token')
    if (token && !isAuthenticated) {
      // Token exists but user is not authenticated, try to get user data
      // This would be handled by the auth store initialization
    }
  }, [isAuthenticated])

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        
        {/* Rotas protegidas */}
        <Route 
          path={ROUTES.HOME} 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.ARTISTS} 
          element={
            <ProtectedRoute>
              <ArtistsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota padrão - redireciona para home se autenticado, senão para login */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
              <Navigate to={ROUTES.HOME} replace /> : 
              <Navigate to={ROUTES.LOGIN} replace />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
