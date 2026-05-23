import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageLayout from './PageLayout'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[calc(100vh-4.75rem)] flex flex-col items-center justify-center bg-sand-lt dark:bg-ink gap-4">
          {/* Spiritual themed gold/saffron pulsing lotus loader */}
          <div className="relative flex items-center justify-center">
            <span className="absolute animate-ping h-8 w-8 rounded-full bg-saffron/20 opacity-75"></span>
            <div className="relative animate-pulse text-3xl select-none">🪷</div>
          </div>
          <p className="font-display text-xs tracking-[0.2em] uppercase text-saffron dark:text-gold-lt animate-pulse">
            Centering...
          </p>
        </div>
      </PageLayout>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
