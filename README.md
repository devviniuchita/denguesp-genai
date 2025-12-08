# AI Chat Frontend - WhatsApp Style Interface

Frontend moderno estilo WhatsApp para interação com agente de IA, construído com Next.js, TypeScript e shadcn/ui.

## 🎯 Características

- **Design Premium**: Interface inspirada no WhatsApp com UX/UI otimizada
- **Responsivo**: Mobile-first design que funciona perfeitamente em todos os dispositivos
- **Acessível**: WCAG AA compliant com navegação por teclado e ARIA labels
- **Preparado para Backend**: Interfaces TypeScript bem definidas para integração fácil
- **Animações Suaves**: Transições e animações usando Framer Motion
- **Dark Mode**: Suporte completo a tema claro/escuro

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router e Turbopack
- **React 19** - Com React Compiler habilitado
- **TypeScript 5.5** - Type safety com strict mode
- **Tailwind CSS 3.4** - Estilização utilitária
- **shadcn/ui** - Componentes UI premium
- **Framer Motion** - Animações
- **Radix UI** - Componentes acessíveis
- **Zod 4** - Validação de schemas
- **ESLint 9** - Flat config com zero warnings policy

## ⚙️ Estado Atual (Dez/2025)

- UI 100% client-side usando mocks em `app/page.tsx` (nenhuma chamada real ao backend ainda).
- Proxy Tactiq ativo: `ProxyInterceptorInit` importa `lib/proxy-interceptor.ts`, que redireciona qualquer `ffp.tactiq.io` para `/app/api/proxy/tactiq/[...path]/route.ts`.
- Hook `hooks/use-chat-websocket.ts` e service `lib/api/chat.ts` já existem como camadas de integração, mas ainda não estão conectados ao fluxo principal.
- `ToastProvider`, `HelpModal`, tour onboarding de 4 passos e indicadores de conexão já estão implementados.

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🏗️ Estrutura do Projeto

```
ai-chat-frontend/
├── app/
│   ├── (home)/                      # Landing pública (Hero)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── components/              # HeroNavigation, HeroHeadline, HeroVisual
│   ├── api/proxy/tactiq/[...path]/route.ts  # Proxy reverso para ffp.tactiq.io
│   ├── chat/
│   │   └── page.tsx                 # Chat mockado + tour + atalhos (antigo app/page.tsx)
│   ├── layout.tsx                   # Importa ProxyInterceptorInit + ToastProvider
│   └── globals.css                  # Tokens e utilitários Tailwind
├── components/
│   ├── chat/                                # ChatWindow, ChatList, MessageBubble, etc.
│   ├── ui/                                  # button, input, scroll-area, tooltip, toast, etc.
│   └── proxy-interceptor-init.tsx           # Carrega lib/proxy-interceptor.ts no cliente
├── docs/
│   ├── CORS_PROXY_SOLUTION.md               # Documentação do proxy Tactiq
│   └── TESTING_GUIDE.md                     # Passos de validação
├── hooks/
│   ├── use-auth-form.ts                     # Hook para formulários de autenticação
│   ├── use-chat-websocket.ts                # Hook pronto para streaming futuro
│   ├── use-keyboard-shortcuts.ts
│   ├── use-media-query.ts
│   └── use-motion-ready.ts                  # Hook para otimização de animações
├── lib/
│   ├── api/chat.ts                          # Client REST mockado
│   ├── date-utils.ts                        # Helpers de formatação
│   ├── proxy-interceptor.ts                 # Intercepta fetch/XHR
│   └── utils.ts                             # `cn` e helpers
├── types/chat.ts
├── public/favicon.ico
├── docs adicionais (README, QUICK_START, STYLE_GUIDE, etc.)
└── configs: package.json, tailwind.config.ts, tsconfig.json
```

## 🔌 Integração com Backend

O frontend está preparado para integração com backend através das interfaces TypeScript definidas em `types/chat.ts`. Enquanto o FastAPI não estiver disponível, `app/page.tsx` continua usando mocks; quando o backend estiver pronto, basta usar `lib/api/chat.ts` e o hook `hooks/use-chat-websocket.ts` para ligar o fluxo real.

## 🎨 Rendering Strategy

### Current Approach

**Static Routes (SSG/ISR):**

- `/` - Landing page (Hero, CTAs, Cards)
- Revalidation: `revalidate: 3600` (1 hour)
- Deploy: Static generation at build time

**Dynamic Routes (SSR):**

- `/auth/login` - Authentication page
- `/auth/register` - Registration page
- `/chat` - Protected chat interface (requires auth)

**API Routes (BFF - Backend for Frontend):**

- `/api/auth/[...nextauth]` - Auth endpoints (mock)
- `/api/chat` - Chat BFF (mock, ready for FastAPI integration)
- Runtime: Edge Functions (produção) / Node.js (dev)

### "use client" Components

Components that require client-side rendering:

- **Interactivity**: `ChatInput`, `MessageBubble`, `ThemeToggle`
- **State management**: `AuthContext`, `ToastProvider`
- **Animations**: `HeroHeadline`, `HeroVisual` (Framer Motion)
- **Forms**: `LoginForm`, `RegisterForm` (react-hook-form)

### Future: Partial Prerendering (PPR)

Next.js 15+ PPR strategy planned (see `docs/PPR_STRATEGY.md`):

- Static shell + dynamic streams in same route
- Suspense boundaries for user-specific content
- Improved TTFB and progressive hydration

## ⚡ Performance & Caching

### Core Web Vitals Targets

| Metric                         | Target  | Current |
| ------------------------------ | ------- | ------- |
| LCP (Largest Contentful Paint) | < 2.5s  | TBD     |
| FID (First Input Delay)        | < 100ms | TBD     |
| CLS (Cumulative Layout Shift)  | < 0.1   | TBD     |
| TTFB (Time to First Byte)      | < 600ms | TBD     |

**Measurement**: See `docs/TESTING_GUIDE.md` for detailed measurement plan.

### Cache Strategy

**Static Content:**

- Landing page: ISR with 1h revalidation
- Assets: Immutable, cached indefinitely
- **CDN**: Vercel Edge Network

**Dynamic Content:**

- User messages: Client-side cache (localStorage)
- Session data: HTTP-only cookies
- API responses: `private, max-age=60` (browser cache)

**Planned Optimizations:**

- SWR/TanStack Query for client-side caching
- Edge caching for BFF routes
- Preload critical fonts and assets

See `docs/PPR_STRATEGY.md` for complete caching roadmap.

### Tipos Principais

- `Message` - Estrutura de mensagem
- `Chat` - Estrutura de conversa
- `SendMessageRequest/Response` - API para enviar mensagens
- `GetMessagesRequest/Response` - API para buscar mensagens

### Exemplo de Integração

```typescript
// Em app/page.tsx:
import { sendMessage } from "@/lib/api/chat";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";

const { messages: wsMessages, isTyping } = useChatWebSocket(
  currentChat?.id ?? null,
);

const handleSendMessage = useCallback(
  async (content: string) => {
    if (!currentChat) return;

    const response = await sendMessage({
      chatId: currentChat.id,
      content,
      userId: "user-id", // recuperar do contexto de auth
    });

    setMessages((prev) => [...prev, response.message]);
    // wsMessages + isTyping trarão as respostas da IA quando o backend emitir via WebSocket
  },
  [currentChat],
);
```

## 🎨 Componentes Principais

### Componentes de Chat

- **ChatWindow**: Janela principal de chat que exibe mensagens e gerencia o estado da conversa
- **ChatList**: Lista lateral de conversas com busca e seleção
- **ChatHeader**: Cabeçalho com ações (chamada, vídeo, busca, etc)
- **ChatInput**: Input de mensagem com suporte a multi-linha, validação e debounce
- **MessageBubble**: Bubble individual de mensagem com status de entrega e leitura
- **ConnectionIndicator**: Indicador visual de status da conexão WebSocket
- **MessageContextMenu**: Menu de contexto para ações em mensagens (copiar, editar, deletar)
- **HelpModal**: Modal de ajuda com atalhos de teclado
- **OnboardingTour**: Tour inicial para novos usuários
- **SearchAutocomplete**: Busca com autocomplete para conversas

### Componentes UI Base

- Componentes shadcn/ui: Button, Input, Avatar, ScrollArea, Tooltip, Toast, ConfirmDialog
- Componentes customizados: BlurFade (animações), DotPattern (background decorativo)

## ✨ Features Implementadas

### Design & UX

- ✅ Interface estilo WhatsApp autêntica
- ✅ Padrão de fundo característico
- ✅ Dark mode completo
- ✅ Animações suaves com Framer Motion
- ✅ Transições otimizadas
- ✅ Cor primária azul `#005cff` aplicada aos botões, bolhas e indicadores

### Funcionalidades Core

- ✅ Envio de mensagens com validação (máx. 4000 caracteres)
- ✅ Indicador de digitação
- ✅ Status de mensagem atualmente em `sending → sent` (delivered/read reservados para a futura integração real)
- ✅ Busca de conversas com autocomplete
- ✅ Lista de conversas com status online
- ✅ Auto-scroll para novas mensagens
- ✅ Input multi-linha com auto-resize
- ✅ Menu de contexto nas mensagens
- ✅ Indicador de conexão WebSocket
- ✅ Atalhos de teclado (Ctrl+K, ESC, etc.)
- ✅ Tour inicial e modal de ajuda
- ✅ Proxy HTTP e interceptor para Tactiq (`/api/proxy/tactiq/*` + `lib/proxy-interceptor.ts`)

### Limitações atuais

- 🔸 Chat e mensagens residem apenas em memória (mock). Não há persistência nem FastAPI conectado.
- 🔸 O hook `use-chat-websocket` e o service `lib/api/chat.ts` ainda não foram plugados ao fluxo principal.
- 🔸 Botões de arquivo, emoji e voz exibem apenas o tooltip “Em breve”.

### Responsividade

- ✅ Mobile-first approach
- ✅ Breakpoints: mobile (≤768px), tablet (769-1024px), desktop (≥1025px)
- ✅ Touch targets ≥ 44px
- ✅ Layout adaptativo

## 📱 Responsividade

- **Mobile**: Layout otimizado para telas pequenas
- **Tablet**: Layout adaptativo com sidebar colapsável
- **Desktop**: Layout completo com sidebar e chat lado a lado

## ♿ Acessibilidade

- ✅ Navegação completa por teclado
- ✅ ARIA labels em todos os elementos interativos
- ✅ Contraste de cores WCAG AA
- ✅ Screen reader friendly
- ✅ Focus management adequado
- ✅ Tooltips informativos em todos os botões/ícones
- ✅ Mensagens de erro claras e acionáveis

## 🔄 Próximos Passos

1. **Integração Backend**: Conectar com API do agente de IA (ver `INTEGRATION_GUIDE.md`)
2. **WebSocket**: Implementar comunicação em tempo real
3. **Features Avançadas**:
   - Suporte a mídia (imagens, vídeos, arquivos)
   - Mensagens de voz
   - Grupos de chat
   - Notificações push
4. **Otimizações**:
   - Virtual scrolling para listas grandes
   - Lazy loading de mensagens
   - Cache de mensagens
   - Offline support

## 📄 Licença

MIT
