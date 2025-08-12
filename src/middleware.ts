import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplica em todas as rotas, exceto as públicas e arquivos estáticos
    '/((?!signin|signup|reset-password|_next|static|favicon.ico|images|icons|public).*)',
  ],
};
