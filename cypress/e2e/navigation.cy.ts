describe('Navigation', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_access_token', 'mock_token');
      win.localStorage.setItem('spotify_user', JSON.stringify({
        id: 'test_user',
        display_name: 'Test User',
        images: [{ url: 'https://example.com/avatar.jpg' }]
      }));
    });

    // Mock API responses
    cy.intercept('GET', '**/me', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/artists/**', { fixture: 'artist.json' }).as('getArtist');
  });

  it('should display navigation sidebar', () => {
    cy.visit('/');
    cy.wait('@getUser');

    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="nav-home"]').should('be.visible');
    cy.get('[data-testid="nav-artistas"]').should('be.visible');
    cy.get('[data-testid="nav-playlists"]').should('be.visible');
    cy.get('[data-testid="nav-perfil"]').should('be.visible');
  });

  it('should navigate between pages', () => {
    cy.visit('/');
    cy.wait('@getUser');

    // Navigate to Artists
    cy.get('[data-testid="nav-artistas"]').click();
    cy.url().should('include', '/artists');
    cy.contains('h1', /Artistas/i).should('be.visible');

    // Navigate to Playlists
    cy.get('[data-testid="nav-playlists"]').click();
    cy.url().should('include', '/playlists');
    cy.contains('h1', /Minhas Playlists/i).should('be.visible');

    // Navigate to Profile
    cy.get('[data-testid="nav-perfil"]').click();
    cy.url().should('include', '/profile');
    cy.contains('h1', /Perfil/i).should('be.visible');
  });

  it('should show active navigation state', () => {
    cy.visit('/artists');
    cy.wait('@getUser');

    cy.get('[data-testid="nav-artistas"]').should('have.class', 'text-white');
    cy.get('[data-testid="nav-home"]').should('not.have.class', 'text-white');
  });

  it('should handle mobile navigation', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.wait('@getUser');

    // Check mobile menu button
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');

    // Open mobile menu
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');

    // Navigate from mobile menu
    cy.get('[data-testid="nav-artistas"]').click();
    cy.url().should('include', '/artists');
  });

  it('should be keyboard accessible', () => {
    cy.visit('/');
    cy.wait('@getUser');

    // Tab through navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'nav-home');

    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'nav-artistas');

    // Enter to navigate
    cy.focused().type('{enter}');
    cy.url().should('include', '/artists');
  });

  it('should show loading states', () => {
    cy.intercept('GET', '**/artists', { delay: 1000, fixture: 'artists.json' }).as('getArtists');

    cy.visit('/artists');
    cy.wait('@getUser');

    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.wait('@getArtists');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should handle network errors gracefully', () => {
    cy.intercept('GET', '**/artists', { forceNetworkError: true }).as('networkError');

    cy.visit('/artists');
    cy.wait('@getUser');

    cy.wait('@networkError');
    cy.contains(/Erro ao carregar|Falha na conexão/i).should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });
});