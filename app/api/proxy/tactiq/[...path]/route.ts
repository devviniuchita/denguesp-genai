import { NextRequest, NextResponse } from 'next/server'

const TACTIQ_PROXY_URL = 'https://ffp.tactiq.io'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params)
  return handleProxyRequest(request, resolvedParams, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params)
  return handleProxyRequest(request, resolvedParams, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params)
  return handleProxyRequest(request, resolvedParams, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolvedParams = await Promise.resolve(params)
  return handleProxyRequest(request, resolvedParams, 'DELETE')
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  })
}

async function handleProxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    // Reconstruir o path da URL
    // params.path já contém os segmentos do path (ex: ['proxy'] ou ['proxy', 'client', 'metrics'])
    const pathArray = params?.path || []
    const path = Array.isArray(pathArray) ? pathArray.join('/') : String(pathArray || '')
    const searchParams = request.nextUrl.searchParams.toString()
    const targetUrl = `${TACTIQ_PROXY_URL}/${path}${searchParams ? `?${searchParams}` : ''}`

    // Obter headers da requisição original
    const headers: HeadersInit = {}
    request.headers.forEach((value, key) => {
      // Não copiar headers que podem causar problemas
      if (
        !['host', 'connection', 'content-length'].includes(key.toLowerCase())
      ) {
        headers[key] = value
      }
    })

    // Preparar body se existir
    let body: BodyInit | undefined
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text()
      } catch {
        body = undefined
      }
    }

    // Fazer requisição para o servidor Tactiq
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    })

    // Obter resposta
    const data = await response.text()
    let jsonData: any
    try {
      jsonData = JSON.parse(data)
    } catch {
      jsonData = data
    }

    // Retornar resposta com headers CORS
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Expose-Headers': '*',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed', message: error instanceof Error ? error.message : 'Unknown error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
      }
    )
  }
}
