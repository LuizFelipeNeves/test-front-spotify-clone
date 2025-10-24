describe('Music Player', () => {
  beforeEach(() => {
    // Simular usuário autenticado
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_access_token', 'fake_token');
      win.localStorage.setItem('spotify_refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('spotify_user', JSON.stringify({
        id: 'test_user',
        display_name: 'Test User',
        email: 'test@example.com'
      }));
    });

    // Interceptar chamadas da API do Spotify
    cy.intercept('GET', '**/me/player/currently-playing', {
      statusCode: 200,
      body: {
        item: {
          id: 'test_track',
          name: 'Test Song',
          artists: [{ name: 'Test Artist' }],
          album: {
            name: 'Test Album',
            images: [{ url: 'https://example.com/image.jpg' }]
          },
          duration_ms: 180000
        },
        is_playing: false,
        progress_ms: 60000
      }
    }).as('getCurrentlyPlaying');

    cy.intercept('GET', '**/me/playlists', {
      statusCode: 200,
      body: {
        items: [
          {
            id: 'test_playlist',
            name: 'Test Playlist',
            images: [{ url: 'https://example.com/playlist.jpg' }],
            tracks: { total: 10 }
          }
        ]
      }
    }).as('getPlaylists');
  });

  it('should display player controls when music is available', () => {
    cy.visit('/');
    
    // Verificar se os controles do player são exibidos
    cy.get('[data-testid="player-controls"]', { timeout: 10000 })
      .should('be.visible');
  });

  it('should display current track information', () => {
    cy.visit('/');
    
    // Aguardar a API ser chamada
    cy.wait('@getCurrentlyPlaying');
    
    // Verificar se as informações da música são exibidas
    cy.contains('Test Song').should('be.visible');
    cy.contains('Test Artist').should('be.visible');
  });

  it('should have functional play/pause button', () => {
    cy.visit('/');
    
    // Interceptar chamadas de play/pause
    cy.intercept('PUT', '**/me/player/play', { statusCode: 204 }).as('playTrack');
    cy.intercept('PUT', '**/me/player/pause', { statusCode: 204 }).as('pauseTrack');
    
    // Aguardar o player carregar
    cy.wait('@getCurrentlyPlaying');
    
    // Testar botão de play/pause
    cy.get('[data-testid="play-pause-button"]')
      .should('be.visible')
      .click();
  });

  it('should display progress bar', () => {
    cy.visit('/');
    
    // Aguardar a API ser chamada
    cy.wait('@getCurrentlyPlaying');
    
    // Verificar se a barra de progresso é exibida
    cy.get('[data-testid="progress-bar"]')
      .should('be.visible');
  });

  it('should display volume controls', () => {
    cy.visit('/');
    
    // Verificar se os controles de volume são exibidos
    cy.get('[data-testid="volume-control"]')
      .should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Simular erro da API
    cy.intercept('GET', '**/me/player/currently-playing', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('getCurrentlyPlayingError');

    cy.visit('/');
    
    // Verificar se a aplicação não quebra com erro da API
    cy.get('body').should('be.visible');
  });
});