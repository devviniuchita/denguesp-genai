'use client'

import { useEffect } from 'react'

export function ProxyInterceptorInit() {
  useEffect(() => {
    // Carregar o interceptor apenas no cliente
    import('@/lib/proxy-interceptor')
  }, [])

  return null
}

