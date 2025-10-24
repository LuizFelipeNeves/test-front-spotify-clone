# 🎵 Magalu Spotify 2

Um clone avançado do Spotify desenvolvido com **React + TypeScript + Vite + Tailwind CSS + PWA**, com foco em **escalabilidade**, **componentização**, e **estrutura limpa** para futuras expansões.

---

## 🚀 Tecnologias Principais

- **React 18 + TypeScript**
- **Vite** – build rápido e moderno
- **Tailwind CSS** – estilização ágil e responsiva
- **ShadCN UI** – biblioteca de componentes acessíveis e consistentes
- **Framer Motion** – animações suaves e performáticas
- **PWA (Progressive Web App)** – suporte offline e instalação em dispositivos
- **ESLint + Prettier** – linting e formatação padronizados
- **Vitest + React Testing Library** – testes unitários
- **Cypress** – testes end-to-end
- **Docker** – ambiente de execução padronizado
- **Storybook** – documentação e desenvolvimento de componentes
- **Sentry** – monitoramento e rastreamento de erros

---

## 🏃‍♂️ Como Rodar o Projeto

### Pré-requisitos

- **Node.js 20+** (recomendado: 20.19+ ou 22.12+)
- **npm** ou **yarn**
- **Docker** (opcional, para execução em containers)

### 📦 Instalação Local

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd magalu-spotify2
```

2. **Instale as dependências:**
```bash
npm install --legacy-peer-deps
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Spotify:
```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

4. **Execute o projeto em desenvolvimento:**
```bash
npm run dev
```
Acesse: http://localhost:5173

### 📚 Storybook

Para visualizar e desenvolver componentes:

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
docker build --target production -t magalu-spotify2:prod .

# Executar container de produção
docker run -d -p 8080:80 --name magalu-spotify2-prod magalu-spotify2:prod
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

## 🧱 Estrutura do Projeto

```

spotify-clone/
├── src/
│   ├── assets/              # Ícones, imagens e vetores
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes base do ShadCN (botões, inputs etc)
│   │   ├── artist/          # Componentes relacionados aos artistas
│   │   ├── playlist/        # Componentes e modais de playlists
│   │   └── profile/         # Componentes da tela de perfil
│   ├── pages/               # Telas principais
│   │   ├── Login/
│   │   ├── Artists/
│   │   ├── Playlist/
│   │   └── Profile/
│   ├── services/            # Serviços para comunicação com a API do Spotify
│   │   ├── api.ts           # Wrapper para fetch e tratamento de erros
│   │   └── spotify.service.ts
│   ├── hooks/               # Hooks customizados
│   ├── store/               # Gerenciamento de estado global (Zustand ou Context API)
│   ├── types/               # Tipagens globais (Artist, Playlist, etc)
│   ├── utils/               # Funções utilitárias
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/                  # Manifest e ícones do PWA
├── .eslintrc.cjs
├── .prettierrc
├── cypress/
├── docker/
│   └── Dockerfile
├── tsconfig.json
├── vite.config.ts
└── README.md

````

---

## 🧩 Funcionalidades (v1)

- [ ] Tela de **Login**
- [ ] Tela de **Artistas**
- [ ] Componente de **Playlists**
- [ ] Tela de **Perfil do Usuário**
- [ ] Componente de **Artista (detalhes)**
- [ ] **Modal de Playlist**
- [ ] Integração com a **API do Spotify**
- [ ] Responsividade (mobile e tablet)
- [x] Suporte **PWA**
- [ ] Configuração de **Sentry**, 
- [ ] Configurar **Lint**
- [ ] Configurar **Storybook**

---

## 🧭 Planejamento Futuro (v2)

- [ ] Módulo de **Player de Música**
- [ ] Tela de **Reprodução Atual**
- [ ] Controles de **Play/Pause, Skip, Shuffle, Volume**
- [ ] Sincronização de estado com API em tempo real
- [ ] Histórico de reprodução e recomendações personalizadas
---

## ⚙️ Configuração do Projeto

### 1️⃣ Criar o projeto base

```bash
npm create vite@latest spotify-clone -- --template react-ts
cd spotify-clone
````

### 2️⃣ Instalar dependências

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion
npm install @tanstack/react-query
npm install @sentry/react @sentry/vite-plugin
npm install -D eslint prettier vite-plugin-pwa cypress vitest @testing-library/react
```

### 3️⃣ Configurar Tailwind

Adicionar em `tailwind.config.js`:

```js
content: ["./index.html", "./src/**/*.{ts,tsx}"],
theme: { extend: {} },
plugins: [],
```

---

## 🧠 Boas Práticas

* Usar **componentes desacoplados e tipados**
* Centralizar regras de negócio nos **services**
* Gerenciar estado global com **Context API ou Zustand**
* Garantir consistência visual com **ShadCN UI**
* Usar **Framer Motion** apenas para microinterações
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

#### ❌ Erro "tailwindcss-animate" no build
- **Causa:** Import incorreto no CSS
- **Solução:** Verificar se `src/index.css` não tem `@import 'tailwindcss-animate'`
- O plugin deve estar apenas no `tailwind.config.js`

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

1. Verifique se está usando Node.js 20+
2. Certifique-se de usar `--legacy-peer-deps` na instalação
3. Verifique se as variáveis de ambiente estão configuradas
4. Consulte os logs do Docker/terminal para mais detalhes

---

## 🧩 Licença

MIT © 2025 — Criado para fins educacionais e estudo de arquitetura front-end moderna.

---
