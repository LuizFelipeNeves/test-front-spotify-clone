describe('Authentication', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
  });

  it('should display login page when not authenticated', () => {
    cy.visit('/');
    
    // Verificar se a página de login é exibida
    cy.contains('Entrar com Spotify').should('be.visible');
    cy.contains('Conecte-se à sua conta do Spotify').should('be.visible');
  });

  it('should have working login button', () => {
    cy.visit('/');
    
    // Verificar se o botão de login existe e é clicável
    cy.get('[data-testid="login-button"]')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('should redirect to Spotify authorization when login button is clicked', () => {
    cy.visit('/');
    
    // Interceptar a requisição para o Spotify
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    
    cy.get('[data-testid="login-button"]').click();
    
    // Verificar se a janela foi aberta (simulação)
    cy.get('@windowOpen').should('have.been.called');
  });

  it('should handle authentication state correctly', () => {
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

    cy.visit('/');
    
    // Verificar se o usuário é redirecionado para a página principal
    // (assumindo que existe uma página principal após login)
    cy.url().should('not.include', '/login');
  });
});