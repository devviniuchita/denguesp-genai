/**
 * Script para interceptar requisições fetch para ffp.tactiq.io
 * e redirecioná-las para o proxy local do Next.js
 */

// Interface para extender XMLHttpRequest com propriedades customizadas
interface ExtendedXMLHttpRequest extends XMLHttpRequest {
  _originalUrl?: string;
  _proxyUrl?: string;
}

const TACTIQ_DOMAIN = 'ffp.tactiq.io';

/**
 * Extrai URL como string de diferentes tipos de input
 */
function extractUrlString(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  if (input instanceof Request) {
    return input.url;
  }
  return String(input);
}

/**
 * Verifica se a URL deve ser interceptada
 */
function shouldIntercept(url: string): boolean {
  return url?.includes(TACTIQ_DOMAIN) ?? false;
}

/**
 * Converte URL original para URL do proxy local
 */
function buildProxyUrl(originalUrlString: string): string {
  const originalUrl = new URL(originalUrlString);
  const path = originalUrl.pathname;
  const searchParams = originalUrl.search;
  const proxyPath = path.startsWith('/') ? path.slice(1) : path;
  return `/api/proxy/tactiq/${proxyPath}${searchParams}`;
}

/**
 * Copia headers de diferentes fontes para um Headers unificado
 */
function mergeHeaders(
  input: RequestInfo | URL,
  init?: RequestInit
): Headers {
  const mergedHeaders = new Headers();

  // Copiar headers do Request original
  if (input instanceof Request) {
    for (const [key, value] of input.headers.entries()) {
      mergedHeaders.set(key, value);
    }
  }

  // Sobrescrever com headers de init
  if (init?.headers) {
    copyHeadersFromInit(init.headers, mergedHeaders);
  }

  return mergedHeaders;
}

/**
 * Copia headers de init para o objeto Headers destino
 */
function copyHeadersFromInit(
  source: HeadersInit,
  destination: Headers
): void {
  if (source instanceof Headers) {
    for (const [key, value] of source.entries()) {
      destination.set(key, value);
    }
  } else if (Array.isArray(source)) {
    for (const [key, value] of source) {
      destination.set(key, value);
    }
  } else {
    for (const [key, value] of Object.entries(source)) {
      destination.set(key, value);
    }
  }
}

/**
 * Extrai valor de propriedade do Request ou init
 */
function getRequestProp<K extends keyof RequestInit>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  prop: K
): RequestInit[K] {
  if (input instanceof Request) {
    return input[prop as keyof Request] as RequestInit[K];
  }
  return init?.[prop];
}

/**
 * Cria as opções de requisição para o proxy
 */
function buildProxyRequestInit(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  mergedHeaders: Headers,
  originalUrl: string
): RequestInit {
  mergedHeaders.set('X-Original-URL', originalUrl);

  return {
    method: getRequestProp(input, init, 'method') ?? 'GET',
    headers: mergedHeaders,
    body: getRequestProp(input, init, 'body'),
    credentials: getRequestProp(input, init, 'credentials'),
    cache: getRequestProp(input, init, 'cache'),
    redirect: getRequestProp(input, init, 'redirect'),
    referrer: getRequestProp(input, init, 'referrer'),
    referrerPolicy: getRequestProp(input, init, 'referrerPolicy'),
    mode: getRequestProp(input, init, 'mode'),
    signal: init?.signal,
  };
}

if (globalThis?.fetch) {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url = extractUrlString(input);

    if (!shouldIntercept(url)) {
      return originalFetch(input, init);
    }

    try {
      const proxyUrl = buildProxyUrl(url);
      console.log(`[Proxy Interceptor] Redirecting ${url} to ${proxyUrl}`);

      const mergedHeaders = mergeHeaders(input, init);
      const proxyInit = buildProxyRequestInit(input, init, mergedHeaders, url);

      return originalFetch(proxyUrl, proxyInit);
    } catch (error) {
      console.error('[Proxy Interceptor] Error intercepting request:', error);
      return originalFetch(input, init);
    }
  };

  // Interceptar XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ) {
    const urlString = url instanceof URL ? url.href : url;
    const asyncValue = async ?? true;

    if (shouldIntercept(urlString)) {
      try {
        const proxyUrl = buildProxyUrl(urlString);
        console.log(`[Proxy Interceptor] XHR Redirecting ${urlString} to ${proxyUrl}`);

        const extThis = this as ExtendedXMLHttpRequest;
        extThis._originalUrl = urlString;
        extThis._proxyUrl = proxyUrl;

        return originalXHROpen.call(this, method, proxyUrl, asyncValue, username, password);
      } catch (error) {
        console.error('[Proxy Interceptor] Error intercepting XHR:', error);
      }
    }

    return originalXHROpen.call(this, method, urlString, asyncValue, username, password);
  };

  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
    const extThis = this as ExtendedXMLHttpRequest;
    if (extThis._originalUrl) {
      this.setRequestHeader('X-Original-URL', extThis._originalUrl);
    }
    return originalXHRSend.call(this, body);
  };

  console.log('[Proxy Interceptor] Initialized - intercepting requests to ffp.tactiq.io');
}

export { buildProxyUrl, shouldIntercept };
