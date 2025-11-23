# Guia de Teste - DengueSP-Gen Frontend

## Visão Geral

Este guia cobre os testes e medições de performance para o DengueSP-Gen Frontend, incluindo testes funcionais, testes de acessibilidade e medição de Core Web Vitals.

## Performance: Core Web Vitals

### Métricas-Chave

As Core Web Vitals são métricas essenciais para medir a experiência do usuário:

| Métrica                            | Descrição                                       | Target  | Como Medir                             |
| ---------------------------------- | ----------------------------------------------- | ------- | -------------------------------------- |
| **LCP** (Largest Contentful Paint) | Tempo até o maior elemento visual estar visível | < 2.5s  | Quando o hero da landing page aparecer |
| **FID** (First Input Delay)        | Tempo entre primeira interação e resposta       | < 100ms | Clicar no botão "Começar"              |
| **CLS** (Cumulative Layout Shift)  | Mudanças inesperadas no layout                  | < 0.1   | Durante carregamento da página         |
| **TTFB** (Time to First Byte)      | Tempo até primeiro byte do servidor             | < 600ms | Primeira resposta HTTP                 |

### Ferramentas de Medição

#### 1. Lighthouse (Integrado no Chrome DevTools)

**Como usar:**

```bash
# Via Chrome DevTools
1. Abrir DevTools (F12)
2. Ir para aba "Lighthouse"
3. Selecionar "Performance" + "Accessibility"
4. Modo: Desktop ou Mobile
5. Clicar em "Analyze page load"
```

**Via CLI:**

```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view --chrome-flags="--headless"
```

**Scores Target:**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

#### 2. WebPageTest

**Como usar:**

1. Ir para [https://www.webpagetest.org](https://www.webpagetest.org)
2. Inserir URL (produção): `https://seu-app.vercel.app`
3. Configurar:
   - Location: São Paulo, Brazil (mais próximo dos usuários)
   - Browser: Chrome
   - Connection: 3G Fast (simular rede móvel)
4. Analisar resultados:
   - First View vs Repeat View
   - Filmstrip view (carregamento visual)
   - Waterfall (sequência de requests)

#### 3. Chrome DevTools Performance

**Passos:**

```bash
1. Abrir DevTools (F12) → Performance
2. Clicar em "Record" (ou Ctrl+E)
3. Navegar pela página (scroll, cliques, etc)
4. Parar gravação
5. Analisar:
   - Main thread activity
   - Network requests
   - Rendering time
   - JavaScript execution
```

**Red flags para investigar:**

- Long tasks (> 50ms)
- Excessive re-renders
- Large JavaScript bundles
- Too many network requests

#### 4. Vercel Analytics (Produção)

**Setup:**

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Benefícios:**

- Real user data (RUM - Real User Monitoring)
- Automático após deploy na Vercel
- Dashboard com Core Web Vitals agregados

### Como Medir Localmente (Desenvolvimento)

**1. Baseline Measurement (Antes de Otimizações)**

```bash
# 1. Build de produção
npm run build
npm run start

# 2. Executar Lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-baseline.html --view

# 3. Documentar scores iniciais
```

**Baseline Example (registrar em cada sprint):**

```
Data: 2025-11-22
Build: Production
Rota: / (Landing)

LCP: 1.8s ✅
FID: 45ms ✅
CLS: 0.05 ✅
TTFB: 320ms ✅
Performance Score: 92

Rota: /chat
LCP: 2.1s ✅
FID: 60ms ✅
CLS: 0.02 ✅
Performance Score: 88
```

**2. Continuous Monitoring**

```bash
# Adicionar ao CI/CD (GitHub Actions)
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/chat
          uploadArtifacts: true
```

### Otimizações Recomendadas (Por Métrica)

#### Melhorar LCP

- [ ] Preload critical assets (fonts, hero image)
- [ ] Lazy load below-the-fold images
- [ ] Optimize image formats (WebP, AVIF)
- [ ] Reduce server response time (TTFB)
- [ ] Use CDN para assets estáticos

#### Melhorar FID

- [ ] Minimize JavaScript execution time
- [ ] Code splitting (dynamic imports)
- [ ] Remove unused JavaScript
- [ ] Use Web Workers para tarefas pesadas
- [ ] Avoid long tasks (> 50ms)

#### Melhorar CLS

- [ ] Definir width/height em imagens
- [ ] Reservar espaço para ads/conteúdo dinâmico
- [ ] Evitar inserir conteúdo acima do fold dinamicamente
- [ ] Use `transform` em vez de `top/left` para animações

## Testes Funcionais

### Checklist de Aceitação (CA-01 a CA-03)

#### CA-01: Envio de Mensagem

- [ ] Textarea aceita Enter para enviar
- [ ] Shift+Enter adiciona nova linha
- [ ] Auto-grow funciona (até 10 linhas)
- [ ] Botão de envio desabilitado quando vazio
- [ ] Mensagem aparece como "sending" → "sent" → "delivered" → "read"
- [ ] Toast de erro se falhar

#### CA-02: Responsividade

**Testar viewports:**

- [ ] 320px (mobile small - iPhone SE)
- [ ] 375px (mobile médio - iPhone 12)
- [ ] 768px (tablet - iPad)
- [ ] 1024px (laptop small)
- [ ] 1440px+ (desktop)

**Verificar:**

- Chat list collapsa em mobile
- Mensagens ocupam < 75% width em desktop
- Botões acessíveis (min 44x44px touch target)

#### CA-03: Lint & Type-check

```bash
npm run lint
npm run type-check
```

**Zero erros permitidos antes de merge.**

## Testes de Acessibilidade

### Ferramentas

**1. axe DevTools (Chrome Extension)**

- Detecta violações WCAG 2.1 AA
- Integrado no Chrome DevTools

**2. Lighthouse Accessibility Audit**

```bash
lighthouse http://localhost:3000 --only-categories=accessibility --view
```

**Target: Score > 95**

### Checklist WCAG 2.1 Level AA

- [ ] Todas as imagens têm `alt` text
- [ ] Contraste de cores ≥ 4.5:1 (texto normal)
- [ ] Contraste de cores ≥ 3:1 (texto grande)
- [ ] Foco do teclado visível
- [ ] Sem "keyboard traps"
- [ ] Headings em ordem lógica (H1 → H2 → H3)
- [ ] Labels em form inputs
- [ ] ARIA roles onde apropriado

## Testes de Responsividade

### Viewports para Testar

| Device Category        | Width  | Height | Device Example         | Priority |
| ---------------------- | ------ | ------ | ---------------------- | -------- |
| **Mobile (Small)**     | 320px  | 568px  | iPhone SE, Galaxy Fold | High     |
| **Mobile (Medium)**    | 375px  | 667px  | iPhone 12/13/14        | High     |
| **Mobile (Large)**     | 414px  | 896px  | iPhone 14 Pro Max      | Medium   |
| **Tablet (Portrait)**  | 768px  | 1024px | iPad                   | High     |
| **Tablet (Landscape)** | 1024px | 768px  | iPad Landscape         | Medium   |
| **Laptop**             | 1366px | 768px  | Small Laptop           | High     |
| **Desktop**            | 1920px | 1080px | Full HD Monitor        | High     |
| **Desktop (Large)**    | 2560px | 1440px | 2K Monitor             | Low      |

### Como Testar

**Chrome DevTools:**

```bash
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Selecionar preset ou custom viewport
4. Testar navegação e interações
```

**Ferramentas Automáticas:**

- [Responsively App](https://responsively.app/) - Visualiza múltiplos viewports simultaneamente
- [BrowserStack](https://www.browserstack.com/) - Testa em devices reais

### Checklist por Rota

#### `/` (Landing Page)

**320px - Mobile Small:**

- [ ] Hero headline legível (sem overflow)
- [ ] Botões CTA visíveis e clicáveis
- [ ] Logo e navegação colapsam corretamente
- [ ] Cards empilham verticalmente
- [ ] Footer legível

**768px - Tablet:**

- [ ] Layout de 2 colunas nos cards
- [ ] Hero visual aparece ao lado do texto
- [ ] Navegação completa visível

**1366px+ - Desktop:**

- [ ] Layout de 3 colunas nos cards
- [ ] Hero totalmente expandido
- [ ] Espaçamento adequado (sem parecer apertado)

#### `/auth/login` e `/auth/register`

**320px:**

- [ ] Formulário ocupa 90% da largura
- [ ] Inputs fáceis de tocar (min 44x44px)
- [ ] Botões de social login empilham

**768px+:**

- [ ] Formulário centralizado (max-width 400px)
- [ ] Background com gradiente visível

#### `/chat`

**320px - Mobile:**

- [ ] Chat list esconde automaticamente
- [ ] Messages ocupam largura completa
- [ ] Input fixo no bottom (não coberto por keyboard virtual)
- [ ] Botões de ação (anexo, emoji) acessíveis
- [ ] Avatar e nome visíveis no header

**768px - Tablet:**

- [ ] Chat list aparece como sidebar (30% width)
- [ ] Messages ocupam 70%
- [ ] Botão para toggle sidebar

**1024px+ - Desktop:**

- [ ] Chat list sempre visível (sidebar fixa)
- [ ] Messages com max-width (não muito largo)
- [ ] Input com botões extras visíveis

### Touch Targets

Todos os elementos interativos devem ter **mínimo 44x44px** para facilitar toque:

- [ ] Botões de navegação
- [ ] Links
- [ ] Ícones (menu, fechar, etc)
- [ ] Inputs de formulário
- [ ] Checkboxes e radio buttons

**Como verificar:**

```javascript
// Console do Chrome
document.querySelectorAll("button, a, input").forEach((el) => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    console.warn("Touch target too small:", el, rect);
  }
});
```

### Orientação (Portrait vs Landscape)

- [ ] Layout adapta em orientação landscape (mobile)
- [ ] Keyboard virtual não esconde conteúdo importante
- [ ] Chat input permanece acessível

### Performance em Mobile

- [ ] Animações suaves (60fps)
- [ ] Scroll sem lag
- [ ] Imagens otimizadas (WebP, tamanhos responsivos)
- [ ] JavaScript bundle < 200KB (gzip)

## Testes de Integração (Futuro)

### Playwright Setup (Planejado para Roadmap Fase 2)

```bash
npm install -D @playwright/test
npx playwright install
```

**Exemplo de teste:**

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from "@playwright/test";

test("should send a message", async ({ page }) => {
  await page.goto("http://localhost:3000/chat");
  await page.fill("[data-testid=chat-input]", "Hello AI!");
  await page.click("[data-testid=send-button]");
  await expect(page.locator(".message-user")).toContainText("Hello AI!");
});
```

## CI/CD Pipeline (Futuro)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type Check
        run: npm run type-check
      - name: Lighthouse
        uses: treosh/lighthouse-ci-action@v9
```

## Solução CORS Proxy (Legacy)

### Como Testar a Solução Tactiq

[Conteúdo original mantido para referência...]

1. Iniciar o servidor
2. Verificar se o interceptor está funcionando
3. Monitorar requisições interceptadas

Ver documentação completa em: `CORS_PROXY_SOLUTION.md`

## Recursos Úteis

- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest Documentation](https://docs.webpagetest.org/)
