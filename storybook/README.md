# Storybook - Documentação de Componentes

Este projeto utiliza o Storybook para documentar e testar componentes de UI de forma isolada.

## 🚀 Como executar

### Desenvolvimento
```bash
npm run storybook
```
Abre o Storybook em modo de desenvolvimento em `http://localhost:6006`

### Build para produção
```bash
npm run build-storybook
```
Gera uma versão estática do Storybook na pasta `storybook-static/`

## 📁 Estrutura

```
.storybook/
├── main.ts          # Configuração principal
└── preview.ts       # Configurações globais de preview

src/components/ui/
├── Button.tsx        # Componente Button
├── Button.stories.tsx
├── Card.tsx          # Componente Card
├── Card.stories.tsx
├── PlayerCard.tsx    # Componente específico do player
└── PlayerCard.stories.tsx
```

## 🎨 Componentes Disponíveis

### Button
Componente de botão com múltiplas variantes:
- **default**: Estilo padrão
- **spotify**: Estilo verde do Spotify
- **secondary**: Estilo secundário
- **destructive**: Para ações destrutivas
- **outline**: Apenas borda
- **ghost**: Transparente
- **link**: Estilo de link

**Tamanhos**: `default`, `sm`, `lg`, `icon`

### Card
Componente de cartão flexível com subcomponentes:
- `Card`: Container principal
- `CardHeader`: Cabeçalho
- `CardTitle`: Título
- `CardDescription`: Descrição
- `CardContent`: Conteúdo
- `CardFooter`: Rodapé

### PlayerCard
Componente específico para o player de música com:
- Informações da música (título, artista)
- Arte do álbum
- Barra de progresso
- Controles de reprodução
- Estados de play/pause

## 🎯 Funcionalidades

### Controles Interativos
Todos os componentes possuem controles interativos no Storybook para testar diferentes props e estados.

### Documentação Automática
Utiliza `autodocs` para gerar documentação automática baseada nos tipos TypeScript.

### Temas
Suporte a temas claro e escuro configurados no preview.

### Responsividade
Testes de responsividade com diferentes viewports.

## 🔧 Configuração

### Addons Instalados
- `@storybook/addon-links`: Navegação entre stories
- `@storybook/addon-essentials`: Conjunto essencial de addons
- `@storybook/addon-interactions`: Testes de interação

### Framework
- **React**: Framework principal
- **Vite**: Build tool
- **TypeScript**: Tipagem estática

## 📝 Como criar novas stories

1. Crie o componente em `src/components/`
2. Crie o arquivo `.stories.tsx` correspondente
3. Defina o meta object com configurações
4. Exporte as diferentes variações como stories

Exemplo:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MeuComponente } from './MeuComponente';

const meta = {
  title: 'UI/MeuComponente',
  component: MeuComponente,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MeuComponente>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props do componente
  },
};
```

## 🎨 Design System

Os componentes seguem o design system do Spotify com:
- Cores baseadas na paleta do Spotify
- Tipografia consistente
- Espaçamentos padronizados
- Estados de hover e focus
- Animações suaves

## 🚀 Próximos Passos

- [ ] Adicionar mais componentes (Input, Select, Modal, etc.)
- [ ] Implementar testes de acessibilidade
- [ ] Adicionar stories para componentes de layout
- [ ] Configurar deploy automático do Storybook
- [ ] Adicionar testes visuais com Chromatic