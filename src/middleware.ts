import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('ENTROU NO MIDDLEWARE');
  const token = request.cookies.get('token')?.value;

  console.log('URL:', request.url);
  console.log('Token no middleware:', token ? 'EXISTS' : 'NOT FOUND');
  console.log('All cookies:', request.cookies.getAll());
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
