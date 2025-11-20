import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadUser() {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      localStorage.removeItem('token')
      delete api.defaults.headers.Authorization
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    api.defaults.headers.Authorization = `Bearer ${token}`
    setUser(user)
    
    return user
  }

  function logout() {
    localStorage.removeItem('token')
    delete api.defaults.headers.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
