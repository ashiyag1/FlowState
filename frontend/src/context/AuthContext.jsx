import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fwa_auth_token'))
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verify token and fetch user details on load
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }

      // If already authenticated (e.g. just logged in), skip fetching again
      if (isAuthenticated && user) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          // Token expired or invalid
          localStorage.removeItem('fwa_auth_token')
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // Login handler
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('fwa_auth_token', data.token)
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      console.error('Login request error:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Signup handler
  const signup = useCallback(async (name, email, password) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      localStorage.setItem('fwa_auth_token', data.token)
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      console.error('Signup request error:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('fwa_auth_token')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      loading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
