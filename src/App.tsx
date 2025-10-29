import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { SpotifyPlayerProvider } from '@/contexts/SpotifyPlayerContext'
import Layout from '@/components/Layout'
import LoginPage from '@/pages/LoginPage'
import CallbackPage from '@/pages/CallbackPage'
import HomePage from '@/pages/HomePage'
import ArtistsPage from '@/pages/ArtistsPage'
import { ArtistDetailPage } from '@/pages/ArtistDetailPage'
import PlaylistsPage from '@/pages/PlaylistsPage'
import ProfilePage from '@/pages/ProfilePage'
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification'
import { ROUTES } from '@/utils/constants'
import './App.css'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // Não tenta novamente se for erro de rede (offline)
        if (error?.message?.includes('Failed to fetch') || !navigator.onLine) {
          return false;
        }
        // Não tenta novamente se for erro 401 (não autorizado)
        if (error?.status === 401) {
          return false;
        }
        // Tenta até 3 vezes para outros erros
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      // Reativa queries quando volta online
      refetchOnReconnect: true,
      // Não faz retry automático quando offline
      networkMode: 'online',
    },
  },
})

// Componente para proteger rotas autenticadas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  
  return <Layout>{children}</Layout>
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
    <QueryClientProvider client={queryClient}>
      <SpotifyPlayerProvider>
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
          <Route 
            path={ROUTES.ARTIST_DETAIL} 
            element={
              <ProtectedRoute>
                <ArtistDetailPage />
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
        
          {/* Componente de notificação de atualização PWA - apenas em produção */}
          {import.meta.env.PROD && <PWAUpdateNotification />}
        </Router>
      </SpotifyPlayerProvider>
    </QueryClientProvider>
  )
}

export default App
