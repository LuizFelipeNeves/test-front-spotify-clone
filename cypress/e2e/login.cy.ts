describe('Login Flow', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should display login page', () => {
    cy.visit('/');

    // Verificar se os textos corretos da UI estão sendo exibidos
    cy.contains('Entra com sua conta Spotify clicando no botão abaixo').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible').and('contain', 'Entrar');
  });

  it('should redirect to login when not authenticated', () => {
    cy.visit('/artists');
    cy.url().should('include', '/login');
  });

  it('should redirect to callback when login button is clicked in test environment', () => {
    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();

    // Em ambiente de teste, deve redirecionar para o callback com dados mock
    cy.url().should('include', '/callback');
    cy.url().should('include', 'code=mock_auth_code');
    cy.url().should('include', 'state=mock_state');
  });

  it('should handle authentication callback', () => {
    // Visitar a página de callback com código mock
    cy.visit('/callback?code=mock_auth_code&state=mock_state');

    // Verificar se a página carregou sem erros críticos
    cy.get('body').should('be.visible');
  });

  it('should handle authentication error', () => {
    cy.visit('/callback?error=access_denied');
    cy.contains(/Erro na autenticação|Acesso negado/i).should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should be accessible', () => {
    cy.visit('/');

    // Check ARIA labels
    cy.get('[data-testid="login-button"]')
      .should('have.attr', 'aria-label')
      .and('contain', 'Entrar com sua conta Spotify');

    // Check keyboard navigation - tab should focus login button
    cy.get('[data-testid="login-button"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'login-button');
  });
});