# 🎵 Spotify Clone
Um clone do Spotify desenvolvido com **React + TypeScript + Vite + Tailwind CSS + PWA**.

* **Gerenciamento de Estado:** Utilizamos **React Query** para gerenciamento de estado assíncrono (cache de dados, requisições) e **Local Storage** para persistência de dados simples, complementado por **React Context** para estados mais localizados ou injeção de dependências.
* **Hooks Customizados:** Lógicas reutilizáveis e complexas são encapsuladas em hooks customizados (`useAuth`, `useSpotifyIntegration`, etc.), promovendo a abstração e facilitando testes.
* **Camada de Serviços:** A lógica de negócio e a interação com APIs externas (como a do Spotify) são centralizadas em uma camada de `services`, garantindo a separação de preocupações e facilitando a manutenção e testes unitários.
* **Acessibilidade (A11y):** Todos os componentes são desenvolvidos com foco em acessibilidade, utilizando semântica HTML apropriada e atributos ARIA quando necessário, garantindo que a aplicação seja utilizável por todos.
* **Estratégia de Testes:** Adotamos uma abordagem abrangente de testes, incluindo:

  * **Testes Unitários:** Com **Vitest**, para garantir a correção de funções e componentes isolados.
  * **Testes E2E:** Com **Cypress**, para validar fluxos de usuário completos e a integração entre diferentes partes da aplicação. 

  * **Testes Visuais e Documentação:** Com **Storybook**, para documentar componentes, facilitar o desenvolvimento isolado e realizar testes visuais em diferentes estados.

   ⚠️ **Observação**: não foi possível finalizar os testes E2E.
---

### Arquitetura e padrões de design

* **Componentização e Reusabilidade:** Componentes isolados, fortemente tipados com TypeScript, organizados por domínio (`features`, `shared`, `ui`). Priorizamos composição e separação clara entre lógica de negócio e apresentação.
* **Gerenciamento de Estado:** **React Query** + **Local Storage** para estados persistentes, complementado por **React Context** para casos específicos.
* **Hooks Customizados:** Abstração de lógica complexa em hooks (`useAuth`, `useSpotifyIntegration`).
* **Camada de Serviços:** Interação com APIs externas centralizada em `services`.
* **Acessibilidade (A11y):** Uso de semântica HTML apropriada e atributos ARIA.
* **Estratégia de Testes:** Testes unitários (Vitest), E2E (Cypress, com instabilidade em alguns casos), testes visuais e documentação (Storybook).

## 🏃‍♂️ Setup

### Pré-requisitos
- **Node.js 18+**
- **npm**

### Instalação

```bash
# Clone
git clone <url-do-repositorio>
cd magalu-spotify2

# Instala dependências
npm install

# Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais do Spotify

# Inicie desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

### 📚 Storybook

```bash
npm run storybook
```
Acesse: http://localhost:6006

### 🐳 Docker

#### Desenvolvimento com Docker

```bash
# Executar aplicação de desenvolvimento
docker-compose --profile dev up --build

# Executar Storybook
docker-compose --profile storybook up --build

# Parar todos os containers
docker-compose down
```

#### Build de Produção

```bash
# Build da imagem de produção
docker build --target production -t magalu-spotify:prod .

# Executar container de produção
docker run -d -p 8080:80 --name magalu-spotify-prod magalu-spotify:prod
```

### 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E com Cypress
npm run cypress:open

# Testes E2E headless
npm run cypress:run
```

---

## 🧩 Funcionalidades (v1)

- [x] Tela de **Login**
- [x] Tela de **Artistas**
- [x] Componente de **Playlists**
- [x] Tela de **Perfil do Usuário**
- [x] Componente de **Artista (detalhes)**
- [x] **Modal de Playlist**
- [x] Integração com a **API do Spotify**
- [x] Responsividade (mobile e tablet)
- [x] Suporte **PWA**
- [x] Configuração de **Sentry**, 
- [x] Configurar **Lint**
- [x] Configurar **Storybook**
- [x] Módulo de **Player de Música**
- [x] Controles de **Play/Pause, Skip, Shuffle, Volume**x
---

## 🧭 Planejamento Futuro (v2)
- [ ] Sincronização de estado com API em tempo real
- [ ] Tela de **Reprodução Atual**
- [ ] Histórico de reprodução e recomendações personalizadas
---

## 🧠 Boas Práticas

* Usar **componentes desacoplados e tipados**
* Centralizar regras de negócio nos **services**
* Adicionar **testes unitários** para todos os componentes reutilizáveis
* Manter o **lint e prettier** rodando em pre-commit (Husky recomendado)

---

## 🐳 Docker

```bash
docker build -t spotify-clone .
docker run -p 5173:5173 spotify-clone
```

---

## 🔎 Monitoramento

Integrar o Sentry no `main.tsx`:

```ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 1.0,
});
```

---

## 📱 PWA

* Configurar manifest.json em `/public`
* Gerar favicon via [favicon.io](https://favicon.io/favicon-converter/)
* Adicionar `vite-plugin-pwa` ao projeto para cache e instalação

---

## 🧪 Testes

### Unitários

```bash
npm run test
```

### E2E

```bash
npm run cypress:open
```

---

## 📘 Storybook

```bash
npm run storybook
```

Documenta todos os componentes visuais e facilita manutenção e escalabilidade.

---

## 📝 Como Rodar Localmente

```bash
git clone https://github.com/usuario/spotify-clone.git
cd spotify-clone
npm install
npm run dev
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ Erro de dependências peer
```bash
# Solução: Use --legacy-peer-deps
npm install --legacy-peer-deps
```

#### ❌ Erro "crypto.hash is not a function"
- **Causa:** Versão do Node.js incompatível
- **Solução:** Use Node.js 20.19+ ou 22.12+
```bash
# Verificar versão do Node
node --version

# Atualizar Node.js se necessário
nvm install 20
nvm use 20
```

#### ❌ Docker build falha
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker build --no-cache --target development -t magalu-spotify2:dev .
```

#### ❌ Porta já em uso
```bash
# Verificar processos na porta
lsof -i :5173  # ou :6006 para Storybook

# Matar processo
kill -9 <PID>
```

#### ❌ Storybook não carrega
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Verificar se não há conflito de versões
npm ls @storybook/core
```

### 🆘 Suporte

Se você encontrar problemas não listados aqui:

1. Verifique se está usando Node.js 18+
2. Certifique-se de usar `--legacy-peer-deps` na instalação
3. Verifique se as variáveis de ambiente estão configuradas
4. Consulte os logs do Docker/terminal para mais detalhes

---

## 🧩 Licença

MIT © 2025 — Criado para fins educacionais e estudo de arquitetura front-end moderna.

---
