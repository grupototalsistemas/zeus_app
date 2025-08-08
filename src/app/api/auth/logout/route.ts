// app/api/auth/logout/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'


export async function POST(request: NextRequest) {
  try {
    // Opcional: chamar logout no backend se necessário
    // await api.post('/auth/logout')
    
    const response = NextResponse.json({ success: true, message: 'Logout realizado com sucesso' })
    
    // Remove o cookie definindo ele com maxAge: 0 e expires no passado
    response.headers.set(
      'Set-Cookie',
      serialize('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Remove imediatamente
        expires: new Date(0), // Data no passado
      })
    )
    
    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Erro no logout' },
      { status: 500 }
    )
  }
}