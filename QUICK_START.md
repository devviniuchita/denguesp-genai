# 🚀 Quick Start Guide

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Executar em desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## 📁 Estrutura do Projeto

```
ai-chat-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página do chat
│   └── globals.css          # Estilos globais
│
├── components/
│   ├── ui/                  # Componentes UI base
│   └── chat/                # Componentes de chat (10 componentes)
│
├── hooks/                   # Hooks customizados
├── types/                   # TypeScript types
└── lib/                     # Utilitários
```

Ver estrutura completa em `README.md`

## ✨ O Que Você Vai Encontrar

- Interface estilo WhatsApp completa
- Tour onboarding em 4 passos + modal de ajuda com atalhos
- 10 componentes de chat funcionais
- Animações suaves com Framer Motion
- Responsividade mobile-first
- Acessibilidade WCAG AA
- Dark mode completo
- Proxy Tactiq ativo (interceptor + rota `/api/proxy/tactiq/[...path]`)
- Preparado para integração com backend (hooks e services já prontos, porém ainda não conectados)

Para detalhes completos, veja `README.md`

## ⚙️ Estado Atual

- O chat utiliza mocks locais (nenhuma chamada real ao FastAPI).
- `ProxyInterceptorInit` é carregado em `app/layout.tsx` para interceptar chamadas da extensão Tactiq.
- `lib/api/chat.ts` e `hooks/use-chat-websocket.ts` estão implementados como camadas de integração, prontos para serem plugados quando o backend estiver disponível.

## 🎯 Próximos Passos

1. Instalar dependências: `npm install`
2. Executar em desenvolvimento: `npm run dev`
3. Abrir `http://localhost:3000` no navegador
4. Validar o proxy Tactiq seguindo `docs/TESTING_GUIDE.md`
5. Para integração com backend real, ver `INTEGRATION_GUIDE.md`

## 🔧 Comandos Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Executar produção
npm run lint     # Verificar código
```

## 📚 Documentação

- `README.md` - Documentação completa do projeto
- `INTEGRATION_GUIDE.md` - Guia de integração com backend
