# Testes E2E com Cypress

Este projeto utiliza Cypress para testes end-to-end (E2E).

## Configuração

O Cypress está configurado para:
- **Base URL**: `http://localhost:5173` (servidor de desenvolvimento Vite)
- **Viewport**: 1280x720
- **Timeout**: 10 segundos
- **Padrão de specs**: `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`

## Scripts Disponíveis

```bash
# Abrir interface do Cypress
npm run cypress:open
npm run e2e:open

# Executar testes em modo headless
npm run cypress:run
npm run e2e
```

## Executando os Testes

### 1. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 2. Executar os testes
Em outro terminal:
```bash
# Interface gráfica
npm run e2e:open

# Modo headless
npm run e2e
```

## Estrutura dos Testes

### Testes Implementados

1. **`auth.cy.ts`** - Testes de autenticação
   - Exibição da página de login
   - Verificação do botão de login
   - Redirecionamento para autorização do Spotify
   - Estados de autenticação

2. **`navigation.cy.ts`** - Testes de navegação
   - Carregamento da aplicação
   - Design responsivo
   - Navegação do browser
   - Atualização de página

3. **`player.cy.ts`** - Testes do player de música
   - Controles do player
   - Informações da faixa atual
   - Botões play/pause
   - Barra de progresso
   - Controles de volume
   - Tratamento de erros da API

### Comandos Customizados

O arquivo `cypress/support/commands.ts` inclui comandos customizados:

- `cy.loginUser()` - Simula login do usuário
- `cy.logoutUser()` - Limpa autenticação
- `cy.mockSpotifyAPI()` - Intercepta e mocka APIs do Spotify
- `cy.waitForAppLoad()` - Aguarda carregamento da aplicação

## Mocks da API

Os testes utilizam interceptações para mockar as APIs do Spotify:
- `/me` - Dados do usuário
- `/me/playlists` - Playlists do usuário
- `/me/top/artists` - Top artistas
- `/me/top/tracks` - Top faixas

## Troubleshooting

### Testes falhando
1. Verifique se o servidor de desenvolvimento está rodando (`npm run dev`)
2. Confirme se a aplicação está acessível em `http://localhost:5173`
3. Verifique se os elementos testados existem na aplicação

### Problemas de timeout
- Aumente o `defaultCommandTimeout` em `cypress.config.ts`
- Use `cy.waitForAppLoad()` para aguardar carregamento

### Problemas de viewport
- Ajuste as dimensões em `cypress.config.ts`
- Use `cy.viewport()` para testes específicos