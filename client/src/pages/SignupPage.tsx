import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateSignUpForm } from '../utils/validation'
import Logo from '../components/Logo'

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signUp, isLoading, error: authError } = useAuth()

  // Get invitation token and email from URL params
  const invitationToken = searchParams.get('invitation')
  const invitationEmail = searchParams.get('email')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Pre-fill email if coming from invitation
  useEffect(() => {
    if (invitationEmail) {
      setEmail(decodeURIComponent(invitationEmail))
    }
  }, [invitationEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)

    // Validate form
    const validation = validateSignUpForm(name, email, password, confirmPassword)
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((err) => {
        errorMap[err.field] = err.message
      })
      setErrors(errorMap)
      return
    }

    // If invitation email is provided, ensure it matches
    if (invitationEmail && email.toLowerCase() !== decodeURIComponent(invitationEmail).toLowerCase()) {
      setErrors({ email: 'Email must match the invitation email' })
      return
    }

    try {
      setErrors({})
      await signUp(email, password, name)

      // If there's an invitation token, redirect to API to accept invitation
      if (invitationToken) {
        // Use internal API route
        window.location.href = `/api/invitations/accept/${invitationToken}`
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      // Error is handled by the auth store
      console.error('Signup failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            {invitationToken ? 'Complete signup to accept your partnership invitation' : 'Start your partnership journey today'}
          </p>
        </div>

        {/* Invitation Notice */}
        {invitationToken && (
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4">
            <p className="text-sm text-indigo-300">
              You've been invited to be someone's partner! Create your account to accept.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{authError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-lg bg-slate-900 border ${
                  hasSubmitted && errors.name ? 'border-red-500' : 'border-slate-700'
                } px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholder="Your name"
                autoComplete="name"
              />
              {hasSubmitted && errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!invitationToken}
                className={`mt-1 block w-full rounded-lg bg-slate-900 border ${
                  hasSubmitted && errors.email ? 'border-red-500' : 'border-slate-700'
                } px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${invitationToken ? 'cursor-not-allowed opacity-75' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {hasSubmitted && errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-lg bg-slate-900 border ${
                  hasSubmitted && errors.password ? 'border-red-500' : 'border-slate-700'
                } px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-indigo-500`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {hasSubmitted && errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full rounded-lg bg-slate-900 border ${
                  hasSubmitted && errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                } px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {hasSubmitted && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}