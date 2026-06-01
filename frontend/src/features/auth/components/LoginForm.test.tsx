import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { LoginForm } from './LoginForm'

test('renders login form', () => {
  render(<LoginForm />)
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
})
