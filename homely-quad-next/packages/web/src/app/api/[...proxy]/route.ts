import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  proxyPath: string[],
  method: string
) {
  try {
    const path = proxyPath.join('/');
    const url = `${API_URL}/${path}`;
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Get headers
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      // Skip host and other Next.js specific headers
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Get body for non-GET requests
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const text = await request.text();
        body = text || undefined;
      } catch (e) {
        // No body
      }
    }

    // Make the request to the backend
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });

    // Get response body
    const responseText = await response.text();
    
    // Forward the response
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
