import api from './api';

const login = async (login: string, senha: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, senha }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro no login')
  }

  return response.json()
}

const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro no logout')
  }
  
  return response.json()
}

const getProfile = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

const updateProfile = async (data: any) => {
  const response = await api.put('/auth/me', data)
  return response.data
}

export const AuthService = {
  login,
  logout,
  getProfile,
  updateProfile,
}