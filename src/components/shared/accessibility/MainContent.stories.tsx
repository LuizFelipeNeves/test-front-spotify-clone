import type { Meta, StoryObj } from '@storybook/react';
import { MainContent } from './MainContent';

const meta = {
  title: 'Accessibility/MainContent',
  component: MainContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MainContent is a semantic wrapper component that provides proper accessibility structure with the main role and appropriate focus management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'The ID attribute for the main element',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    children: 'Main content area',
    id: 'main-content',
  },
} satisfies Meta<typeof MainContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h1>Conteúdo Principal</h1>
        <p>Este é o conteúdo principal da página.</p>
      </div>
    ),
    id: 'main-content',
  },
};

export const CustomId: Story = {
  args: {
    children: (
      <div>
        <h2>Conteúdo com ID Personalizado</h2>
        <p>Este conteúdo usa um ID personalizado.</p>
      </div>
    ),
    id: 'custom-main',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: (
      <div>
        <h2>Conteúdo Estilizado</h2>
        <p>Este conteúdo tem classes CSS personalizadas.</p>
      </div>
    ),
    className: 'p-8 bg-gray-100 rounded-lg',
  },
};

export const ComplexContent: Story = {
  render: () => (
    <MainContent className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Cabeçalho do Conteúdo
        </h1>
        <p className="text-gray-600">
          Este é o cabeçalho dentro do conteúdo principal.
        </p>
      </header>

      <nav className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Navegação Secundária
        </h2>
        <ul className="flex gap-4">
          <li>
            <a href="#section1" className="text-blue-600 hover:text-blue-800">
              Seção 1
            </a>
          </li>
          <li>
            <a href="#section2" className="text-blue-600 hover:text-blue-800">
              Seção 2
            </a>
          </li>
          <li>
            <a href="#section3" className="text-blue-600 hover:text-blue-800">
              Seção 3
            </a>
          </li>
        </ul>
      </nav>

      <main>
        <section id="section1" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seção 1</h2>
          <p className="text-gray-700 mb-4">
            Conteúdo da primeira seção com informações importantes.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Botão de Interação
          </button>
        </section>

        <section id="section2" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seção 2</h2>
          <p className="text-gray-700 mb-4">
            Conteúdo da segunda seção com elementos interativos.
          </p>
          <input
            type="text"
            placeholder="Digite algo..."
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
          />
        </section>

        <section id="section3">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seção 3</h2>
          <p className="text-gray-700 mb-4">
            Conteúdo da terceira seção com mais informações.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded">Card 1</div>
            <div className="bg-gray-100 p-4 rounded">Card 2</div>
            <div className="bg-gray-100 p-4 rounded">Card 3</div>
          </div>
        </section>
      </main>

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 text-center">
          Rodapé do conteúdo principal
        </p>
      </footer>
    </MainContent>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of complex content structure within MainContent, including navigation, sections, forms, and interactive elements.',
      },
    },
  },
};

export const AccessibilityFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: `### Accessibility Features

The MainContent component provides comprehensive accessibility support:

#### Semantic HTML
- Uses proper \`<main>\` element with \`role="main"\`
- Provides landmark navigation for screen reader users
- Supports proper document outline structure

#### Focus Management
- \`tabIndex={-1}\` allows focus management
- Works with browser focus trapping in modals
- Maintains logical tab order

#### Screen Reader Support
- Announces "main" landmark when focused
- Provides context for content navigation
- Works with all major screen readers

#### Testing Checklist
- [ ] Main landmark is announced by screen readers
- [ ] Tab order is logical and predictable
- [ ] Focus moves properly through content
- [ ] Interactive elements are keyboard accessible
- [ ] Content structure is semantically correct

#### Browser Support
- ✅ Chrome (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Edge (full support)
- ✅ All major screen readers`,
      },
    },
  },
  render: () => (
    <div className="p-8">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
          <h3 className="text-green-800 font-bold mb-2">
            ✅ Recursos de Acessibilidade
          </h3>
          <ul className="text-green-700 text-left list-disc list-inside">
            <li>Elemento &lt;main&gt; semântico</li>
            <li>Atributo role="main" correto</li>
            <li>Gerenciamento de foco adequado</li>
            <li>Navegação por teclado total</li>
            <li>Suporte a leitores de tela</li>
          </ul>
        </div>
      </div>

      <MainContent className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Demonstração de Acessibilidade
        </h1>
        <p className="text-gray-600 mb-6">
          Este componente demonstra como implementar acessibilidade em áreas de
          conteúdo principais.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Conteúdo Navegável</h2>
            <p className="text-gray-700">
              Teste a navegação por teclado e com leitores de tela neste
              conteúdo.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Teste Botão
            </button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Formulário</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="test-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Campo de Teste
                </label>
                <input
                  id="test-input"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Digite para testar"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Enviar
              </button>
            </form>
          </section>
        </div>
      </MainContent>
    </div>
  ),
};

export const SkipLinkIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: `### SkipLink Integration

This story demonstrates how MainContent works with SkipLink components:

**Usage Pattern:**
1. SkipLink targets the MainContent ID
2. User can jump directly to main content
3. Focus lands at the beginning of main content
4. Proper landmark structure is maintained

**Best Practices:**
- Use meaningful IDs for main content
- Pair with appropriate skip links
- Ensure logical document structure
- Test with keyboard navigation

**Benefits:**
- Faster navigation for keyboard users
- Better experience for screen reader users
- Improved WCAG 2.1 compliance
- Enhanced usability overall`,
      },
    },
  },
  render: () => (
    <div>
      <div className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-green-500 text-black px-4 py-2 rounded-md font-semibold z-50">
        <a href="#main-content" className="text-black no-underline">
          Pular para conteúdo principal
        </a>
      </div>

      <MainContent id="main-content" className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Página com SkipLink</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            Funcionalidade SkipLink
          </h2>
          <p className="text-blue-700 mb-4">
            Você pode usar Tab para navegar até o link "Pular para conteúdo
            principal" e pressionar Enter para pular diretamente para cá.
          </p>
          <div className="bg-blue-100 rounded p-3">
            <p className="text-blue-800 text-sm">
              <strong>Dica:</strong> Teste com Tab → Enter para verificar o
              funcionamento.
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Conteúdo Principal</h2>
          <p className="text-gray-700 mb-4">
            Este é o conteúdo principal da página. Quando você usa o SkipLink,
            deve pular diretamente para esta área.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Seção 1</h3>
              <p className="text-gray-600">Conteúdo da primeira seção.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Seção 2</h3>
              <p className="text-gray-600">Conteúdo da segunda seção.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Seção 3</h3>
              <p className="text-gray-600">Conteúdo da terceira seção.</p>
            </div>
          </div>
        </section>
      </MainContent>
    </div>
  ),
};

export const ResponsiveDesign: Story = {
  render: () => (
    <MainContent className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            Layout Responsivo
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            O MainContent funciona perfeitamente com layouts responsivos,
            mantendo a acessibilidade em todos os tamanhos de tela.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Card Mobile</h3>
              <p className="text-gray-600">
                Layout otimizado para dispositivos móveis.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Card Desktop</h3>
              <p className="text-gray-600">Layout expandido para desktops.</p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Conteúdo Adaptativo</h2>
            <p className="text-gray-700">
              Este conteúdo se adapta automaticamente ao tamanho da tela,
              mantendo a usabilidade e acessibilidade em todos os dispositivos.
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Sidebar</h3>
            <p className="text-gray-600">Conteúdo lateral em desktops.</p>
          </div>
        </div>
      </div>
    </MainContent>
  ),
  parameters: {
    docs: {
      description:
        'Responsive design example showing MainContent working with adaptive layouts.',
    },
  },
};
