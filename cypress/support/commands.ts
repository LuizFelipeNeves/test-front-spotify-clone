/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para simular login do usuário
Cypress.Commands.add('loginUser', (user = {
  id: 'test_user',
  display_name: 'Test User',
  email: 'test@example.com'
}) => {
  cy.window().then((win) => {
    win.localStorage.setItem('spotify_access_token', 'fake_token');
    win.localStorage.setItem('spotify_refresh_token', 'fake_refresh_token');
    win.localStorage.setItem('spotify_user', JSON.stringify(user));
  });
});

// Comando para limpar autenticação
Cypress.Commands.add('logoutUser', () => {
  cy.clearLocalStorage();
});

// Comando para interceptar APIs do Spotify
Cypress.Commands.add('mockSpotifyAPI', () => {
  // Mock da API de usuário atual
  cy.intercept('GET', '**/me', {
    statusCode: 200,
    body: {
      id: 'test_user',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [{ url: 'https://example.com/avatar.jpg' }]
    }
  }).as('getUser');

  // Mock da API de playlists
  cy.intercept('GET', '**/me/playlists', {
    statusCode: 200,
    body: {
      items: [
        {
          id: 'playlist1',
          name: 'My Playlist',
          images: [{ url: 'https://example.com/playlist1.jpg' }],
          tracks: { total: 25 }
        }
      ]
    }
  }).as('getPlaylists');

  // Mock da API de top artists
  cy.intercept('GET', '**/me/top/artists', {
    statusCode: 200,
    body: {
      items: [
        {
          id: 'artist1',
          name: 'Test Artist',
          images: [{ url: 'https://example.com/artist1.jpg' }],
          genres: ['pop', 'rock']
        }
      ]
    }
  }).as('getTopArtists');

  // Mock da API de top tracks
  cy.intercept('GET', '**/me/top/tracks', {
    statusCode: 200,
    body: {
      items: [
        {
          id: 'track1',
          name: 'Test Song',
          artists: [{ name: 'Test Artist' }],
          album: {
            name: 'Test Album',
            images: [{ url: 'https://example.com/album1.jpg' }]
          },
          duration_ms: 180000
        }
      ]
    }
  }).as('getTopTracks');
});

// Comando para aguardar carregamento
Cypress.Commands.add('waitForAppLoad', () => {
  cy.get('body').should('be.visible');
  cy.get('[data-testid="loading"]').should('not.exist');
});
//   }
// }