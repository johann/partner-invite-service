/**
 * Form validation utilities
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) return 'Email is required'
  if (!emailRegex.test(email)) return 'Invalid email address'
  
  return null
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
  
  return null
}

/**
 * Validate name
 */
export function validateName(name: string): string | null {
  if (!name) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters'
  if (name.length > 50) return 'Name must be less than 50 characters'
  
  return null
}

/**
 * Validate signup form
 */
export function validateSignUpForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: ValidationError[] = []

  const nameError = validateName(name)
  if (nameError) errors.push({ field: 'name', message: nameError })

  const emailError = validateEmail(email)
  if (emailError) errors.push({ field: 'email', message: emailError })

  const passwordError = validatePassword(password)
  if (passwordError) errors.push({ field: 'password', message: passwordError })

  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: "Passwords don't match" })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!email) errors.push({ field: 'email', message: 'Email is required' })
  if (!password) errors.push({ field: 'password', message: 'Password is required' })

  return {
    isValid: errors.length === 0,
    errors,
  }
}