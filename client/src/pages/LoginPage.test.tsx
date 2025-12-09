import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'
import * as useAuthModule from '../hooks/useAuth'
import { renderWithProviders } from '../test/helpers'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  const mockUseAuth = vi.spyOn(useAuthModule, 'useAuth')
  const mockSignIn = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      initialized: true,
      initialize: vi.fn(),
      signIn: mockSignIn,
      signUp: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    })
  })

  it('renders login form correctly', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('validates email field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })

    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('validates password field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('submits form and navigates on success', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue(undefined)

    renderWithProviders(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message on failed login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: 'Invalid credentials',
      initialized: true,
      initialize: vi.fn(),
      signIn: mockSignIn,
      signUp: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    })

    renderWithProviders(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,
      initialized: true,
      initialize: vi.fn(),
      signIn: mockSignIn,
      signUp: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    })

    renderWithProviders(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /signing in/i })
    expect(submitButton).toBeDisabled()
  })

  it('link to signup page works', () => {
    renderWithProviders(<LoginPage />)

    const signupLink = screen.getByText(/sign up/i)
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
})