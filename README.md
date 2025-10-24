# 🎵 Spotify Clone (v1)

Um clone simplificado do Spotify desenvolvido com **React + TypeScript + Vite + Tailwind CSS + PWA**, com foco em **escalabilidade**, **componentização**, e **estrutura limpa** para futuras expansões (como o módulo de player na versão 2).

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
- **Sentry** – monitoramento e rastreamento de erros

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

## 🧩 Licença

MIT © 2025 — Criado para fins educacionais e estudo de arquitetura front-end moderna.

---
