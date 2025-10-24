describe('Navigation', () => {
  beforeEach(() => {
    // Simular usuário autenticado para testes de navegação
    cy.window().then((win) => {
      win.localStorage.setItem('spotify_access_token', 'fake_token');
      win.localStorage.setItem('spotify_refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('spotify_user', JSON.stringify({
        id: 'test_user',
        display_name: 'Test User',
        email: 'test@example.com'
      }));
    });
  });

  it('should load the application successfully', () => {
    cy.visit('/');
    
    // Verificar se a aplicação carrega sem erros
    cy.get('body').should('be.visible');
  });

  it('should have responsive design', () => {
    cy.visit('/');
    
    // Testar em diferentes tamanhos de tela
    cy.viewport(1280, 720); // Desktop
    cy.get('body').should('be.visible');
    
    cy.viewport(768, 1024); // Tablet
    cy.get('body').should('be.visible');
    
    cy.viewport(375, 667); // Mobile
    cy.get('body').should('be.visible');
  });

  it('should handle page refresh correctly', () => {
    cy.visit('/');
    
    // Recarregar a página
    cy.reload();
    
    // Verificar se a aplicação ainda funciona
    cy.get('body').should('be.visible');
  });

  it('should handle browser back/forward navigation', () => {
    cy.visit('/');
    
    // Simular navegação (se houver rotas)
    cy.go('back');
    cy.go('forward');
    
    // Verificar se a aplicação ainda funciona
    cy.get('body').should('be.visible');
  });
});