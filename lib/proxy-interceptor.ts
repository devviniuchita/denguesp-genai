/**
 * Script para interceptar requisições fetch para ffp.tactiq.io
 * e redirecioná-las para o proxy local do Next.js
 */

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Extrair URL de diferentes tipos de input
    let url: string;
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.href;
    } else if (input instanceof Request) {
      url = input.url;
    } else {
      // Fallback para outros tipos
      url = String(input);
    }

    // Verificar se a requisição é para ffp.tactiq.io
    if (url && url.includes('ffp.tactiq.io')) {
      // Extrair o path e query params da URL original
      try {
        const originalUrl = new URL(url);
        // Extrair o path completo (ex: /proxy ou /proxy/client/metrics)
        const path = originalUrl.pathname;
        const searchParams = originalUrl.search;

        // Construir nova URL para o proxy local
        // Manter o path completo removendo apenas a barra inicial
        const proxyPath = path.startsWith('/') ? path.slice(1) : path;
        const proxyUrl = `/api/proxy/tactiq/${proxyPath}${searchParams}`;

        console.log(`[Proxy Interceptor] Redirecting ${url} to ${proxyUrl}`);

        // Preparar headers combinando init e headers do Request original
        const mergedHeaders = new Headers();

        // Se input é um Request, copiar seus headers
        if (input instanceof Request) {
          input.headers.forEach((value, key) => {
            mergedHeaders.set(key, value);
          });
        }

        // Sobrescrever com headers de init se existirem
        if (init?.headers) {
          if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
              mergedHeaders.set(key, value);
            });
          } else if (Array.isArray(init.headers)) {
            init.headers.forEach(([key, value]) => {
              mergedHeaders.set(key, value);
            });
          } else {
            Object.entries(init.headers).forEach(([key, value]) => {
              mergedHeaders.set(key, value);
            });
          }
        }

        // Adicionar header com URL original
        mergedHeaders.set('X-Original-URL', url);

        // Fazer requisição para o proxy local
        return originalFetch(proxyUrl, {
          method: input instanceof Request ? input.method : init?.method || 'GET',
          headers: mergedHeaders,
          body: input instanceof Request ? input.body : init?.body,
          credentials: input instanceof Request ? input.credentials : init?.credentials,
          cache: input instanceof Request ? input.cache : init?.cache,
          redirect: input instanceof Request ? input.redirect : init?.redirect,
          referrer: input instanceof Request ? input.referrer : init?.referrer,
          referrerPolicy: input instanceof Request ? input.referrerPolicy : init?.referrerPolicy,
          mode: input instanceof Request ? input.mode : init?.mode,
          signal: init?.signal,
        });
      } catch (error) {
        console.error('[Proxy Interceptor] Error intercepting request:', error);
        // Se houver erro, fazer requisição original
        return originalFetch(input, init);
      }
    }

    // Para outras URLs, usar fetch original
    return originalFetch(input, init);
  };

  // Também interceptar XMLHttpRequest se necessário
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ) {
    const urlString = typeof url === 'string' ? url : url.href;

    if (urlString.includes('ffp.tactiq.io')) {
      try {
        const originalUrl = new URL(urlString);
        const path = originalUrl.pathname;
        const searchParams = originalUrl.search;
        const proxyPath = path.startsWith('/') ? path.slice(1) : path;
        const proxyUrl = `/api/proxy/tactiq/${proxyPath}${searchParams}`;

        console.log(`[Proxy Interceptor] XHR Redirecting ${urlString} to ${proxyUrl}`);

        // Armazenar URL original para uso no send
        (this as any)._originalUrl = urlString;
        (this as any)._proxyUrl = proxyUrl;

        return originalXHROpen.call(
          this,
          method,
          proxyUrl,
          async !== undefined ? async : true,
          username,
          password
        );
      } catch (error) {
        console.error('[Proxy Interceptor] Error intercepting XHR:', error);
      }
    }

    return originalXHROpen.call(
      this,
      method,
      urlString,
      async !== undefined ? async : true,
      username,
      password
    );
  };

  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
    // Adicionar header com URL original se existir
    if ((this as any)._originalUrl) {
      this.setRequestHeader('X-Original-URL', (this as any)._originalUrl);
    }

    return originalXHRSend.call(this, body);
  };

  console.log('[Proxy Interceptor] Initialized - intercepting requests to ffp.tactiq.io');
}

export {};
