import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, ErrorMessage, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { auth, googleProvider } from '../lib/firebase'

function friendlyError(err: unknown): string {
  if (!(err instanceof FirebaseError)) return 'Something went wrong'
  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password'
    case 'auth/email-already-in-use':
      return 'An account with that email already exists'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters'
    case 'auth/popup-closed-by-user':
      return ''
    default:
      return err.message
  }
}

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/symbols'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Once Firebase reports a logged-in user, leave this page.
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user, navigate, redirectTo])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="mx-auto max-w-sm pt-8">
      <Card>
        <h1 className="text-xl font-semibold">{isLogin ? 'Log in' : 'Create an account'}</h1>
        <p className="mt-1 text-sm text-muted">
          {isLogin ? 'Welcome back to StockWatch.' : 'Save a watchlist and get price alerts.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          <ErrorMessage message={error} />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-line" /> or <div className="h-px flex-1 bg-line" />
        </div>

        <Button variant="primary" onClick={handleGoogle} className="w-full">
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link to={isLogin ? '/register' : '/login'} state={location.state} className="text-accent hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </Card>
    </div>
  )
}
