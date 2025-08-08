// app/api/auth/login/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import api from '@/service/api'


export async function POST(request: NextRequest) {
  try {
    const { login, senha } = await request.json()
    
    const res = await api.post('/auth/login', { login, senha })
    const data = res.data
    
    const response = NextResponse.json({ success: true })
    
    response.headers.set(
      'Set-Cookie',
      serialize('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    )
    
    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Erro no login' },
      { status: 401 }
    )
  }
}