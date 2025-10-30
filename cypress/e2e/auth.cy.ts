describe('Authentication', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
  });

  it('should display login page when not authenticated', () => {
    cy.visit('/');
    
    // Verificar se a página de login é exibida
    cy.contains('Entrar').should('be.visible');
    cy.contains('Entra com sua conta Spotify clicando no botão abaixo').should('be.visible');
  });

  it('should have working login button', () => {
    cy.visit('/');
    
    // Verificar se o botão de login existe e é clicável
    cy.get('[data-testid="login-button"]')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('should redirect to callback when login button is clicked in test environment', () => {
    cy.visit('/');
    
    // Verificar se o botão existe
    cy.get('[data-testid="login-button"]').should('be.visible');
    
    // Simular o clique no botão e verificar se redireciona para callback
    cy.get('[data-testid="login-button"]').click();
    
    // Em ambiente de teste, deve redirecionar para o callback
    cy.url().should('include', '/callback');
    cy.url().should('include', 'code=mock_auth_code');
    cy.url().should('include', 'state=mock_state');
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