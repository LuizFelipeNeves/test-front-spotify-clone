# Docker - Containerização

Este projeto está configurado para rodar em containers Docker, facilitando o desenvolvimento, testes e deploy.

## 🐳 Estrutura Docker

```
├── Dockerfile              # Multi-stage build (dev/prod)
├── Dockerfile.storybook     # Container para Storybook
├── Dockerfile.cypress       # Container para testes E2E
├── docker-compose.yml       # Orquestração de serviços
├── nginx.conf              # Configuração do nginx para produção
└── .dockerignore           # Arquivos ignorados no build
```

## 🚀 Como usar

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev

# Ou usando docker-compose diretamente
docker-compose --profile dev up --build
```

Acesse: `http://localhost:5173`

### Produção

```bash
# Build e execução em produção
npm run docker:prod

# Ou usando docker-compose diretamente
docker-compose --profile prod up --build
```

Acesse: `http://localhost:80`

### Storybook

```bash
# Executar Storybook em container
npm run docker:storybook

# Ou usando docker-compose diretamente
docker-compose --profile storybook up --build
```

Acesse: `http://localhost:6006`

### Testes E2E

```bash
# Executar testes Cypress
npm run docker:test

# Ou usando docker-compose diretamente
docker-compose --profile test up --build
```

## 🔧 Comandos Docker

### Build Manual

```bash
# Build da imagem completa
npm run docker:build

# Build apenas desenvolvimento
npm run docker:build:dev

# Build apenas produção
npm run docker:build:prod
```

### Execução Manual

```bash
# Executar desenvolvimento
npm run docker:run:dev

# Executar produção
npm run docker:run:prod
```

### Limpeza

```bash
# Parar containers e limpar sistema
npm run docker:clean
```

## 📁 Detalhes dos Containers

### Aplicação Principal (Dockerfile)

**Stage Development:**
- Base: `node:18-alpine`
- Porta: `5173`
- Volume: Código fonte montado para hot-reload
- Comando: `npm run dev`

**Stage Production:**
- Base: `nginx:alpine`
- Porta: `80`
- Servidor: Nginx com configuração otimizada
- Assets: Build estático da aplicação

### Storybook (Dockerfile.storybook)

- Base: `node:18-alpine`
- Porta: `6006`
- Volume: Código fonte montado
- Comando: `npm run storybook`

### Cypress (Dockerfile.cypress)

- Base: `cypress/included:13.6.0`
- Dependência: `app-dev`
- Volume: Testes e configurações
- Comando: `cypress run`

## 🌐 Configuração Nginx

### Funcionalidades

- **Gzip**: Compressão automática
- **Cache**: Headers de cache para assets estáticos
- **SPA**: Suporte a client-side routing
- **Security**: Headers de segurança
- **Health Check**: Endpoint `/health`

### Headers de Segurança

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🔄 Profiles do Docker Compose

### dev
Ambiente de desenvolvimento com hot-reload

### prod
Ambiente de produção com nginx

### storybook
Documentação de componentes

### test
Execução de testes E2E

## 📋 Variáveis de Ambiente

### Desenvolvimento
```env
NODE_ENV=development
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### Produção
```env
NODE_ENV=production
```

### Cypress
```env
CYPRESS_baseUrl=http://app-dev:5173
```

## 🚀 Deploy

### Build para Produção

```bash
# 1. Build da imagem
docker build --target production -t magalu-spotify2:latest .

# 2. Tag para registry
docker tag magalu-spotify2:latest your-registry/magalu-spotify2:latest

# 3. Push para registry
docker push your-registry/magalu-spotify2:latest
```

### Docker Hub

```bash
# Login
docker login

# Build e push
docker build --target production -t username/magalu-spotify2:latest .
docker push username/magalu-spotify2:latest
```

## 🔍 Troubleshooting

### Problemas Comuns

**Container não inicia:**
```bash
# Verificar logs
docker-compose logs app-dev

# Rebuild sem cache
docker-compose build --no-cache
```

**Porta já em uso:**
```bash
# Verificar processos na porta
lsof -i :5173

# Parar todos os containers
docker-compose down
```

**Problemas de permissão:**
```bash
# Linux/Mac - ajustar permissões
sudo chown -R $USER:$USER .
```

### Logs e Debug

```bash
# Logs em tempo real
docker-compose logs -f app-dev

# Entrar no container
docker-compose exec app-dev sh

# Verificar status
docker-compose ps
```

## 🎯 Próximos Passos

- [ ] Configurar CI/CD com GitHub Actions
- [ ] Implementar health checks
- [ ] Configurar monitoring com Prometheus
- [ ] Adicionar backup automático
- [ ] Implementar blue-green deployment