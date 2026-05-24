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

  // Update profile (name, bio, location, preferences)
  const updateProfile = useCallback(async (data) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Update failed')
      setUser(prev => ({ ...prev, ...result.user }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [token])

  // Update avatar
  const updateAvatar = useCallback(async (base64) => {
    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: base64 })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Avatar update failed')
      setUser(prev => ({ ...prev, avatar: result.user?.avatar || base64 }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [token])

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Password change failed')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [token])

  // Delete account
  const deleteAccount = useCallback(async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Delete failed')
      }
      logout()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [token, logout])

  return (
    <AuthContext.Provider value={{
      token,
      user,
      setUser,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      updateAvatar,
      changePassword,
      deleteAccount
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
