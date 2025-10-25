export function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-8 py-8 sm:py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
          Bem-vindo ao Spotify
        </h1>
        <p className="text-gray-400 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
          Selecione uma opção no menu lateral para começar a explorar sua música
        </p>
      </div>
    </div>
  );
}

export default HomePage;