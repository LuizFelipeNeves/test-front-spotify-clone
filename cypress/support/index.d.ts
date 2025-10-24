/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Simula login do usuário
     */
    loginUser(user?: { id: string; display_name: string; email: string }): Chainable<void>
    
    /**
     * Limpa autenticação do usuário
     */
    logoutUser(): Chainable<void>
    
    /**
     * Intercepta e mocka APIs do Spotify
     */
    mockSpotifyAPI(): Chainable<void>
    
    /**
     * Aguarda carregamento da aplicação
     */
    waitForAppLoad(): Chainable<void>
  }
}