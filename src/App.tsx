import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar status de conexão
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  Magalu Spotify
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOnline
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            PWA com Vite + React + Tailwind
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Uma aplicação Progressive Web App moderna e responsiva
          </p>
        </div>

        {/* Interactive Counter */}
        <div className="mt-16 text-center">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contador Interativo
            </h3>
            <div className="text-6xl font-bold text-blue-600 mb-6">{count}</div>
            <div className="space-x-4">
              <button
                onClick={() => setCount(count + 1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Incrementar
              </button>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            &copy; 2024 Magalu Spotify. Feito com ❤️ usando Vite + React +
            Tailwind + PWA
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
