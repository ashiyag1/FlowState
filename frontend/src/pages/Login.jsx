import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { useNotif } from '../components/system/NotificationPopup'
import { useAuth } from '../context/AuthContext'
import PageLayout from '../components/ui/PageLayout'

const stagger = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function DecoCircle({ className, size, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-ink/60 dark:text-sand-lt/60 tracking-wide uppercase">{label}</label>
      <div className="relative group">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
        {children}
      </div>
    </div>
  )
}

const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm border bg-white/70 backdrop-blur-sm placeholder:text-mist-dark/40 ' +
  'focus:outline-none focus:ring-2 focus:ring-saffron/25 focus:border-saffron/50 transition-all duration-300 ' +
  'dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30'

import { useEffect } from 'react'

export default function Login() {
  const notif = useNotif()
  const navigate = useNavigate()
  const { login, signup, onSocialLogin } = useAuth()
  const [mode, setMode] = useState('login')
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleGoogleLoginWithToken = async (accessToken) => {
    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      })
      const data = await res.json()
      if (res.ok) {
        onSocialLogin(data)
        notif('Signed in with Google ✦', 'success')
        navigate('/')
      } else {
        notif(data.error || 'Google sign-in failed', 'error')
      }
    } catch {
      notif('Google sign-in failed', 'error')
    }
  }

  // Parse redirect token if returning from a redirect oauth flow (for PWAs)
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      if (accessToken) {
        window.history.replaceState(null, null, ' ')
        handleGoogleLoginWithToken(accessToken)
      }
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (mode === 'login') {
      const res = await login(form.email, form.password)
      if (res.success) {
        notif('Welcome back ✦', 'success')
        navigate('/')
      } else {
        notif(res.error || 'Login failed', 'error')
      }
    } else {
      const res = await signup(form.name, form.email, form.password)
      if (res.success) {
        notif('Account created successfully ✦', 'success')
        navigate('/')
      } else {
        notif(res.error || 'Signup failed', 'error')
      }
    }
  }

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      notif('Google Client ID not configured — add VITE_GOOGLE_CLIENT_ID to frontend .env', 'error')
      return
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

    if (isStandalone) {
      // Use OAuth Redirect Flow inside standalone apps since popup windows (window.open) are blocked
      const redirectUri = encodeURIComponent(window.location.origin + '/login')
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile%20openid`
      window.location.href = oauthUrl
      return
    }

    // Default Popup Flow for standard browser tabs
    const loadGoogle = () => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.access_token) {
            await handleGoogleLoginWithToken(response.access_token)
          }
        },
        error_callback: () => notif('Google sign-in cancelled', 'error')
      })
      client.requestAccessToken()
    }
    if (!window.google) {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true
      s.onload = loadGoogle
      document.head.appendChild(s)
    } else {
      loadGoogle()
    }
  }

  return (
    <PageLayout>
      <div className="relative min-h-[calc(100vh-4.75rem)] flex items-center justify-center px-4 overflow-hidden">
        {/* Decorative background elements */}
        <DecoCircle className="-top-32 -left-32 bg-saffron/10 blur-3xl" size="500px" delay={0} />
        <DecoCircle className="-bottom-40 -right-32 bg-gold/10 blur-3xl" size="550px" delay={0.15} />
        <DecoCircle className="top-1/3 right-1/4 bg-ocean/8 blur-2xl" size="300px" delay={0.3} />

        {/* Floating decorative dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-saffron/20 dark:bg-gold/20"
            style={{
              top: `${18 + i * 13}%`,
              left: `${8 + (i % 3) * 42}%`,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

        <motion.div variants={stagger} initial="initial" animate="animate" className="w-full max-w-sm relative z-10">
          {/* Brand */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron to-gold shadow-glow-saffron mb-4">
              <Sparkles size={22} className="text-white" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink dark:text-sand-lt tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Join FlowState'}
            </h1>
            <p className="text-sm text-mist-dark dark:text-ocean-lt/60 mt-1.5 font-light">
              {mode === 'login' ? 'Sign in to continue your practice' : 'Begin your journey of mindful flow'}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div variants={scaleIn}>
            <div className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl-soft p-6 md:p-8">
              <form onSubmit={submit} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Field label="Your Name" icon={User}>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set('name')}
                          className={`${inputBase} !pl-10`}
                          placeholder="Ashiya"
                          required
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label="Email address" icon={Mail}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    className={`${inputBase} !pl-10`}
                    placeholder="you@example.com"
                    required
                  />
                </Field>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-ink/60 dark:text-sand-lt/60 tracking-wide uppercase">Password</label>
                    {mode === 'login' && (
                      <button type="button" className="text-[11px] text-ocean dark:text-ocean-lt/80 hover:underline font-medium">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
                    <input
                      type={show ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      className={`${inputBase} !pl-10 !pr-10`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-dark/50 hover:text-ink dark:hover:text-white transition-colors"
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-saffron to-gold text-white text-sm font-semibold tracking-wide shadow-glow-saffron hover:shadow-lg hover:shadow-saffron/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} className="transition-transform duration-300" />
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gold/15 dark:border-gold/10" />
                </div>
                <div className="relative text-center">
                  <span className="text-[11px] text-mist-dark/50 dark:text-ocean-lt/40 bg-white dark:bg-transparent px-3 tracking-wider uppercase">or continue with</span>
                </div>
              </div>

              {/* Social */}
              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  onClick={handleGoogleSignIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold/20 bg-white/60 dark:bg-white/[0.03] text-xs font-medium text-ink/70 dark:text-sand-lt/70 hover:bg-saffron/5 hover:border-saffron/30 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Toggle mode */}
          <motion.p variants={fadeUp} className="text-center text-sm text-mist-dark dark:text-ocean-lt/50 mt-6">
            {mode === 'login' ? "New to FlowState? " : 'Already have an account? '}
            <button
              onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
              className="text-saffron dark:text-gold-lt font-semibold hover:underline underline-offset-2"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </motion.p>

        </motion.div>
      </div>
    </PageLayout>
  )
}
