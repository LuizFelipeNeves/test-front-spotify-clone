import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/pages/LoginPage'
import CallbackPage from '@/pages/CallbackPage'
import './App.css'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token')
    if (token && !isAuthenticated) {
      // Token exists but user is not authenticated, try to get user data
      // This would be handled by the auth store initialization
    }
  }, [isAuthenticated])

  // Handle routing based on current path
  const currentPath = window.location.pathname

  if (currentPath === '/login') {
    return <LoginPage />
  }

  if (currentPath === '/callback') {
    return <CallbackPage />
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }

  // Main app content for authenticated users
  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Spotify App</h1>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  {user.images?.[0] && (
                    <img 
                      src={user.images[0].url} 
                      alt={user.display_name} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm">{user.display_name}</span>
                </div>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('spotify_access_token')
                  localStorage.removeItem('spotify_refresh_token')
                  window.location.href = '/login'
                }}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Spotify App!</h1>
            <p className="text-muted-foreground mb-8">
              Você está autenticado com sucesso.
            </p>
            {user && (
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-2">Seus dados do Spotify:</h2>
                <p><strong>Nome:</strong> {user.display_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>País:</strong> {user.country}</p>
                <p><strong>Seguidores:</strong> {user.followers?.total || 0}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default App
