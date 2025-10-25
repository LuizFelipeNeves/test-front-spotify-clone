import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/pages/LoginPage'
import CallbackPage from '@/pages/CallbackPage'
import HomePage from '@/pages/HomePage'
import ArtistsPage from '@/pages/ArtistsPage'
import PlaylistsPage from '@/pages/PlaylistsPage'
import ProfilePage from '@/pages/ProfilePage'
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification'
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
  const { isAuthenticated, login } = useAuthStore()

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('spotify_access_token')
      const refreshToken = localStorage.getItem('spotify_refresh_token')
      
      if (token && !isAuthenticated) {
        try {
          // Importar o spotifyService dinamicamente para evitar problemas de dependência circular
          const { spotifyService } = await import('@/services/spotify.service')
          const userData = await spotifyService.getUserProfile()
          login(token, refreshToken || '', userData)
        } catch (error) {
          console.error('Failed to restore authentication:', error)
          // Se falhar, limpar tokens inválidos
          localStorage.removeItem('spotify_access_token')
          localStorage.removeItem('spotify_refresh_token')
        }
      }
    }

    initializeAuth()
  }, [isAuthenticated, login])

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
        <Route path={ROUTES.PLAYLISTS} element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            } />
            <Route path={ROUTES.PROFILE} element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
        
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
      
      {/* Componente de notificação de atualização PWA */}
      <PWAUpdateNotification />
    </Router>
  )
}

export default App
