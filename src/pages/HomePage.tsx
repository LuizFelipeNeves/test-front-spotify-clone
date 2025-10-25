import Layout from '@/components/Layout';

export function HomePage() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bem-vindo ao Spotify
          </h1>
          <p className="text-gray-400 text-lg">
            Selecione uma opção no menu lateral para começar
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;