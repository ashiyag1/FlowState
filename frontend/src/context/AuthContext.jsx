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
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setIsAuthenticated(true)
        } else if (res.status === 401) {
          // Only sign out on 401 — token is genuinely invalid or expired
          const keysToRemove = [
            'fwa_auth_token', 'fwa_guest_name', 'fwa_mockup_sankalpa',
            'fwa_mockup_ritual_done', 'fwa_onboarding_completed', 'fwa_wisdom_read',
            'wisdom_saved', 'wisdom_saved_pages', 'wisdom_page_notes', 
            'wisdom_streak_log', 'wisdom_opened_books', 'wisdom_book_progress'
          ]
          keysToRemove.forEach(k => localStorage.removeItem(k))
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        } else {
          // Any other error (404, 500, network issues, server restart) — 
          // keep the token, stay logged in, retry will happen on next navigation
          console.warn('Auth check returned status', res.status, '— keeping session alive')
          // If we have a stored token, trust it and keep user logged in
          // The server may have just restarted or be temporarily unavailable
        }
      } catch (err) {
        // Network error — server may be down or restarting
        // Do NOT sign out — keep the session alive
        console.error('Auth check network error — keeping session alive:', err.message)
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
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Clear guest session data so it doesn't bleed back when they log out later
      const keysToRemove = [
        'fwa_guest_name', 'fwa_mockup_sankalpa', 'fwa_mockup_ritual_done', 
        'fwa_onboarding_completed', 'fwa_wisdom_read', 'wisdom_saved', 
        'wisdom_saved_pages', 'wisdom_page_notes', 'wisdom_streak_log', 
        'wisdom_opened_books', 'wisdom_book_progress'
      ]
      keysToRemove.forEach(k => localStorage.removeItem(k))

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
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Clear guest session data
      const keysToRemove = [
        'fwa_guest_name', 'fwa_mockup_sankalpa', 'fwa_mockup_ritual_done', 
        'fwa_onboarding_completed', 'fwa_wisdom_read', 'wisdom_saved', 
        'wisdom_saved_pages', 'wisdom_page_notes', 'wisdom_streak_log', 
        'wisdom_opened_books', 'wisdom_book_progress'
      ]
      keysToRemove.forEach(k => localStorage.removeItem(k))

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

  // Social login (Google/Apple) — sets auth state from external token
  const onSocialLogin = useCallback((data) => {
    localStorage.setItem('fwa_auth_token', data.token)
    setToken(data.token)
    setUser(data.user)
    setIsAuthenticated(true)
  }, [])

  // Logout handler
  const logout = useCallback(() => {
    // Clear auth and all legacy/guest data to prevent data bleed
    const keysToRemove = [
      'fwa_auth_token', 'fwa_guest_name', 'fwa_mockup_sankalpa',
      'fwa_mockup_ritual_done', 'fwa_onboarding_completed', 'fwa_wisdom_read',
      'wisdom_saved', 'wisdom_saved_pages', 'wisdom_page_notes', 
      'wisdom_streak_log', 'wisdom_opened_books', 'wisdom_book_progress'
    ]
    keysToRemove.forEach(k => localStorage.removeItem(k))
    
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // Update profile (name, bio, location, preferences)
  const updateProfile = useCallback(async (data) => {
    try {
      const res = await fetch('/api/v1/profile', {
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
      const res = await fetch('/api/v1/profile/avatar', {
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
      const res = await fetch('/api/v1/profile/password', {
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
      const res = await fetch('/api/v1/profile', {
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

  // Adjust points
  const adjustPoints = useCallback(async (xpDiff, pranaDiff = 0) => {
    if (!isAuthenticated || !token) return
    try {
      const res = await fetch('/api/v1/profile/adjust-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpDiff, pranaDiff })
      })
      if (res.ok) {
        const result = await res.json()
        if (result.user) {
          setUser(prev => ({ ...prev, ...result.user }))
          return { success: true, user: result.user }
        }
      }
    } catch (err) {
      console.error('Failed to adjust points:', err)
    }
  }, [isAuthenticated, token])

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
      onSocialLogin,
      updateProfile,
      updateAvatar,
      changePassword,
      deleteAccount,
      adjustPoints
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
