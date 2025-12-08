# File Tree: denguesp-genai

**Generated:** 12/08/2025
**Root Path:** `c:\Users\ADMIN\Desktop\denguesp-genai`

## Stack Técnica
- **Next.js 16.0.8** com Turbopack e App Router
- **React 19.2** com React Compiler
- **TypeScript 5.5** strict mode
- **ESLint 9** flat config (eslint.config.mjs)
- **Zod 4** para validação de schemas
- **SonarQube compliant** - Zero warnings

```
├── 📁 .github
│   ├── 📄 copilot-instructions.md
│   └── 📁 workflows
│       ├── ⚙️ ci.yml
│       └── ⚙️ lighthouse.yml
├── 📁 app
│   ├── 📁 (home)
│   │   ├── 📁 components
│   │   │   ├── 📄 HeroHeadline.tsx
│   │   │   ├── 📄 HeroNavigation.tsx
│   │   │   ├── 📄 HeroVisual.tsx
│   │   │   ├── 📄 HeroVisualDynamic.tsx
│   │   │   ├── 📄 InitiateChatButton.tsx
│   │   │   └── 📄 ScriptOptimization.tsx
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 api
│   │   ├── 📁 auth
│   │   │   └── 📁 [...nextauth]
│   │   │       └── 📄 route.ts
│   │   ├── 📁 chat
│   │   │   └── 📄 route.ts
│   │   └── 📁 proxy
│   │       └── 📁 tactiq
│   │           └── 📁 [...path]
│   │               └── 📄 route.ts
│   ├── 📁 auth
│   │   ├── 📁 components
│   │   │   ├── 📄 AuthCard.tsx
│   │   │   └── 📄 SocialButton.tsx
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 register
│   │   │   └── 📄 page.tsx
│   │   └── 📄 layout.tsx
│   ├── 📁 chat
│   │   └── 📄 page.tsx
│   ├── 📁 como-funciona
│   │   └── 📄 page.tsx
│   ├── 📁 privacidade
│   │   └── 📄 page.tsx
│   ├── 📁 termos
│   │   └── 📄 page.tsx
│   ├── 🎨 globals.css
│   ├── 📄 hydration-optimizer.tsx
│   ├── 📄 layout.tsx
│   ├── 🎨 syntax-highlight.css
│   └── 📄 web-vitals.tsx
├── 📁 components
│   ├── 📁 animations
│   │   └── 📄 LazyMotionProvider.tsx
│   ├── 📁 chat
│   │   ├── 📄 ChatHeader.tsx
│   │   ├── 📄 ChatInput.tsx
│   │   ├── 📄 ChatList.tsx
│   │   ├── 📄 ChatWindow.tsx
│   │   ├── 📄 ConnectionIndicator.tsx
│   │   ├── 📄 HelpModal.tsx
│   │   ├── 📄 MarkdownMessage.tsx
│   │   ├── 📄 MessageBubble.tsx
│   │   ├── 📄 MessageContextMenu.tsx
│   │   ├── 📄 OnboardingTour.tsx
│   │   └── 📄 SearchAutocomplete.tsx
│   ├── 📁 ui
│   │   ├── 📄 avatar.tsx
│   │   ├── 📄 blur-fade.tsx
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 checkbox.tsx
│   │   ├── 📄 confirm-dialog.tsx
│   │   ├── 📄 dot-pattern.tsx
│   │   ├── 📄 dropdown-menu.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 label.tsx
│   │   ├── 📄 password-input.tsx
│   │   ├── 📄 scroll-area.tsx
│   │   ├── 📄 separator.tsx
│   │   ├── 📄 skeleton.tsx
│   │   ├── 📄 theme-toggle.tsx
│   │   ├── 📄 toast.tsx
│   │   └── 📄 tooltip.tsx
│   └── 📄 proxy-interceptor-init.tsx
├── 📁 contexts
│   └── 📄 AuthContext.tsx
├── 📁 docs
│   ├── 📝 BACKEND_INTEGRATION.md
│   ├── 📝 CORS_PROXY_SOLUTION.md
│   ├── 📝 PERFORMANCE_BASELINE.md
│   ├── 📝 PPR_STRATEGY.md
│   ├── 📝 TESTING_GUIDE.md
│   ├── 📝 requirements-catalog.md
│   └── 📝 requirements-gap-matrix.md
├── 📁 hooks
│   ├── 📄 use-auth-form.ts
│   ├── 📄 use-chat-websocket.ts
│   ├── 📄 use-keyboard-shortcuts.ts
│   ├── 📄 use-media-query.ts
│   └── 📄 use-motion-ready.ts
├── 📁 lib
│   ├── 📁 api
│   │   ├── 📄 auth.ts
│   │   └── 📄 chat.ts
│   ├── 📁 storage
│   │   └── 📄 messages.ts
│   ├── 📄 date-utils.ts
│   ├── 📄 message-utils.ts
│   ├── 📄 motion-features.ts
│   ├── 📄 proxy-interceptor.ts
│   ├── 📄 session.ts
│   └── 📄 utils.ts
├── 📁 public
│   ├── 📁 assets
│   │   └── 📁 branding
│   │       ├── 🖼️ apple-touch-icon.png
│   │       ├── 🖼️ denguegen-icon.png
│   │       ├── 🖼️ denguegen-logo.png
│   │       ├── 🖼️ favicon-16x16.png
│   │       ├── 🖼️ favicon-32x32.png
│   │       ├── 📄 favicon.ico
│   │       └── 🖼️ unnamed.jpg
│   └── 📄 favicon.ico
├── 📁 types
│   ├── 📄 auth.ts
│   └── 📄 chat.ts
├── ⚙️ .editorconfig
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── ⚙️ .prettierignore
├── 📝 INTEGRATION_GUIDE.md
├── 📝 PLANODEACAO.md
├── 📝 PRD.md
├── 📝 PROJECT_STRUTURE.md
├── 📝 QUICK_START.md
├── 📝 README.md
├── 📝 STYLE_GUIDE.md
├── ⚙️ eslint.config.mjs                    # ESLint 9 flat config
├── 📄 next-env.d.ts
├── ⚙️ next.config.mjs                      # Next.js config (Turbopack, React Compiler)
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 proxy.ts                             # Middleware de autenticação
├── 📄 tailwind.config.ts
├── ⚙️ tsconfig.json
└── 📄 vercel.json
```

---
*Atualizado em Dez/2025*
