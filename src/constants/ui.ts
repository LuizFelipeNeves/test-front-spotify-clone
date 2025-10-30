// Textos fixos da interface
export const UI_TEXTS = {
  // Loading e Estados
  loading: 'Carregando...',
  loadingDescription: 'Conteúdo sendo carregado, aguarde...',
  carregandoMaisItens: 'Carregando mais itens...',

  // Estados vazios e erro
  nenhumItemEncontrado: 'Nenhum item encontrado',
  nenhumItemDescricao: 'Não há itens para exibir no momento.',
  opsAlgoDeuErrado: 'Ops! Algo deu errado',

  // Autenticação
  entrarComSpotify: 'Entra com sua conta Spotify clicando no botão abaixo',
  entrar: 'Entrar',
  processandoAutenticacao: 'Processando autenticação...',
  erroNaAutenticacao: 'Erro na autenticação:',
  tentarNovamente: 'Tentar novamente',

  // Página Home
  bemVindoAoSpotify: 'Bem-vindo ao Spotify',
  selecioneOpcaoMenu: 'Selecione uma opção no menu lateral para começar a explorar sua música',

  // Artistas
  artistas: 'Artistas',
  descubraArtistas: 'Descubra e explore seus artistas favoritos',
  carregandoMaisArtistas: 'Carregando mais artistas...',
  nenhumAlbumEncontrado: 'Nenhum álbum, single ou compilação encontrado',
  nenhumAlbumDescricao: 'Parece que este artista ainda não tem lançamentos disponíveis.',

  // Playlists
  minhasPlaylists: 'Minhas Playlists',
  colecaoPlaylists: 'Sua coleção pessoal de playlists',
  criarPlaylist: 'Criar Playlist',
  carregandoMaisPlaylists: 'Carregando mais playlists...',

  // Modal Criar Playlist
  nomePlaylist: 'Dê um nome a sua playlist',
  nomePlaylistPlaceholder: 'Minha playlist #1',
  criando: 'Criando...',
  criar: 'Criar',

  // Perfil
  perfil: 'Perfil',
  informacoesPessoais: 'Suas informações pessoais',
  sair: 'Sair',

  // Status de Conexão
  online: 'Online',
  offline: 'Offline',

  // PWA Update
  novaVersaoDisponivel: 'Nova versão disponível',
  novaVersaoDescricao: 'Uma nova versão do app está disponível. Atualize para obter as últimas funcionalidades.',
  atualizando: 'Atualizando...',
  atualizar: 'Atualizar',
  depois: 'Depois',

  // Formatos e contagens
  seguidores: 'seguidores',
  faixas: 'faixas',

  // Ações
  play: 'Play',
  pausar: 'Pausar',
  proxima: 'Próxima',
  anterior: 'Anterior',
  aleatorio: 'Aleatório',
  repetir: 'Repetir',
  repetirFaixa: 'Repetir faixa',
  volume: 'Volume',
  mute: 'Mudo',

  // Tempo
  aoVivo: 'AO VIVO',
};

// Configurações de UI
export const UI_CONFIG = {
  // Formatos de imagem fallback
  imagens: {
    artistaFallback: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    albumFallback: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    playlistFallback: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    perfilFallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    spotifyFallback: 'https://images.unsplash.com/photo-1593699582626-c3b75b3d9aee?w=640&h=640&fit=crop',
  },

  // Grids responsivos
  grids: {
    albums: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4',
    albuns: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4',
    artistas: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4',
    playlists: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4',
  },

  // Cores e estilos
  cores: {
    primaria: '#1DB954', // Verde Spotify
    fundo: '#121212',
    superficie: '#181818',
    texto: '#FFFFFF',
    textoSecundario: '#B3B3B3',
  }
};

// Tipos para componentes genéricos
export type StatusType = 'empty' | 'error' | 'loading';

export type MediaType = 'artist' | 'album' | 'playlist';

export interface MediaItemBase {
  id: string;
  name: string;
  images: Array<{ url: string; height?: number; width?: number }>;
  uri: string;
}