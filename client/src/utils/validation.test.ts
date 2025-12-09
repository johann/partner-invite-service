import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateSignUpForm,
} from './validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBeNull()
      expect(validateEmail('user.name@domain.co.uk')).toBeNull()
      expect(validateEmail('user+tag@example.com')).toBeNull()
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('')).toBe('Email is required')
      expect(validateEmail('notanemail')).toBe('Invalid email address')
      expect(validateEmail('@example.com')).toBe('Invalid email address')
      expect(validateEmail('user@')).toBe('Invalid email address')
    })
  })

  describe('validatePassword', () => {
    it('accepts strong passwords', () => {
      expect(validatePassword('Password123')).toBeNull()
    })

    it('requires minimum length', () => {
      expect(validatePassword('Pass1')).toBe('Password must be at least 8 characters')
    })

    it('requires uppercase letter', () => {
      expect(validatePassword('password123')).toBe('Password must contain at least one uppercase letter')
    })

    it('requires lowercase letter', () => {
      expect(validatePassword('PASSWORD123')).toBe('Password must contain at least one lowercase letter')
    })

    it('requires number', () => {
      expect(validatePassword('Password')).toBe('Password must contain at least one number')
    })

    it('requires password', () => {
      expect(validatePassword('')).toBe('Password is required')
    })
  })

  describe('validateName', () => {
    it('accepts valid names', () => {
      expect(validateName('John Doe')).toBeNull()
      expect(validateName('Alice')).toBeNull()
    })

    it('requires name', () => {
      expect(validateName('')).toBe('Name is required')
    })

    it('requires minimum length', () => {
      expect(validateName('A')).toBe('Name must be at least 2 characters')
    })

    it('enforces maximum length', () => {
      const longName = 'A'.repeat(51)
      expect(validateName(longName)).toBe('Name must be less than 50 characters')
    })
  })

  describe('validateLoginForm', () => {
    it('validates correct login form', () => {
      const result = validateLoginForm('test@example.com', 'Password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('requires email', () => {
      const result = validateLoginForm('', 'Password123')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'email')).toBe(true)
    })

    it('requires password', () => {
      const result = validateLoginForm('test@example.com', '')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'password')).toBe(true)
    })

    it('passes with any non-empty email and password', () => {
      const result = validateLoginForm('anyemail', 'anypassword')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateSignUpForm', () => {
    it('validates correct signup form', () => {
      const result = validateSignUpForm('John Doe', 'test@example.com', 'Password123', 'Password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('requires name', () => {
      const result = validateSignUpForm('', 'test@example.com', 'Password123', 'Password123')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'name')).toBe(true)
    })

    it('requires name with at least 2 characters', () => {
      const result = validateSignUpForm('A', 'test@example.com', 'Password123', 'Password123')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'name')).toBe(true)
    })

    it('requires email', () => {
      const result = validateSignUpForm('John Doe', '', 'Password123', 'Password123')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'email')).toBe(true)
    })

    it('validates password strength', () => {
      const result = validateSignUpForm('John Doe', 'test@example.com', 'weak', 'weak')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'password')).toBe(true)
    })

    it('checks password confirmation match', () => {
      const result = validateSignUpForm('John Doe', 'test@example.com', 'Password123', 'Different123')
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.field === 'confirmPassword')).toBe(true)
    })

    it('returns multiple errors for invalid form', () => {
      const result = validateSignUpForm('', '', '', '')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(2)
    })
  })
})