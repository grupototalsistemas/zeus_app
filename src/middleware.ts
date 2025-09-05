import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // console.log('=== MIDDLEWARE DEBUG ===');
  // console.log('URL:', request.nextUrl.pathname);
  // console.log('Cookies raw:', request.headers.get('cookie'));

  const token = request.cookies.get('token');
  // console.log('Token object:', token);
  // console.log('Token value:', token?.value);

  // Lista TODOS os cookies
  const allCookies = request.cookies.getAll();
  // console.log('All cookies:', allCookies);

  // if (!token?.value) {
  //   console.log('REDIRECIONANDO - Token não encontrado');
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }

  // console.log('PERMITINDO - Token encontrado');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/listar-chamado/:path*',
    '/dashboard/:path*',
    // Remova temporariamente as outras rotas para testar
  ],
};

// export const config = {
//   matcher: [
//     // Aplica em todas as rotas, exceto as públicas e arquivos estáticos
//     '/((?!signin|signup|reset-password|_next|static|favicon.ico|images|icons|public).*)',
//   ],
// };
