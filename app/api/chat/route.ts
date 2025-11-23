import { Message } from '@/types/chat';
import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF para Chat - Proxy/Mock para FastAPI backend
 * Este endpoint receberá mensagens do frontend e retornará respostas mockadas
 * Futuramente, será um proxy para o backend FastAPI
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, content, userId } = body;

    // Validação básica
    if (!chatId || !content || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: chatId, content, userId' },
        { status: 400 }
      );
    }

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Criar mensagem do usuário
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      userId,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    // Simular resposta da IA
    const aiResponse: Message = {
      id: `msg_${Date.now() + 1}`,
      chatId,
      userId: 'ai-assistant',
      content: `Esta é uma resposta mockada à sua mensagem: "${content}". O backend FastAPI será integrado em breve!`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    // TODO: Quando o FastAPI estiver disponível:
    // const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000"
    // const response = await fetch(`${fastApiUrl}/api/chat/messages`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ chatId, content, userId }),
    // })
    // const data = await response.json()
    // return NextResponse.json(data)

    return NextResponse.json({
      message: userMessage,
      aiResponse,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!chatId) {
      return NextResponse.json({ error: 'Missing required parameter: chatId' }, { status: 400 });
    }

    // Mock de mensagens históricas
    const mockMessages: Message[] = [
      {
        id: 'msg_1',
        chatId,
        userId: 'user-123',
        content: 'Olá! Como posso me proteger da dengue?',
        role: 'user',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        status: 'sent',
      },
      {
        id: 'msg_2',
        chatId,
        userId: 'ai-assistant',
        content:
          'Olá! Para se proteger da dengue, é importante eliminar água parada, usar repelente e instalar telas em janelas.',
        role: 'assistant',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        status: 'sent',
      },
    ];

    // TODO: Integração com FastAPI
    // const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000"
    // const response = await fetch(
    //   `${fastApiUrl}/api/chat/messages?chatId=${chatId}&limit=${limit}&offset=${offset}`
    // )
    // const data = await response.json()
    // return NextResponse.json(data)

    return NextResponse.json({
      messages: mockMessages.slice(offset, offset + limit),
      total: mockMessages.length,
      hasMore: offset + limit < mockMessages.length,
    });
  } catch (error) {
    console.error('Error in GET /api/chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
