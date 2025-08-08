import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  // Se não tiver token, redireciona para o login
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Se tiver token, segue para a página normalmente
  return NextResponse.next()
}

// Defina as rotas que precisam de proteção
export const config = {
  matcher: [
    '/dashboard',
    '/listar-chamado',
    '/listar-chamado/:path*',
    '/criar-chamado',
    '/criar-chamado/:path*',
  ],
}

