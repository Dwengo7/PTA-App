// src/__tests__/login.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../login'
import { useAuth } from '../../../contexts/authContext'
import { doSignInWithEmailAndPassword } from '../../../firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// —————————————— mocks ——————————————
jest.mock('../../../contexts/authContext')
jest.mock('../../../firebase/auth')
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}))

// mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// —————————————— tests ——————————————
describe('Login page', () => {
  // Silence expected console.error from our catch() so it
  // doesn’t fail the test suite
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // pretend user is not already logged in
    useAuth.mockReturnValue({ userLoggedIn: false })
    getFirestore.mockReturnValue({})   // db instance, not used in test
    doc.mockReturnValue({})            // doc ref, not used in test
  })

  it('renders email/password inputs and sign-in button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('redirects teacher to /teacherhome after successful login', async () => {
    doSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } })
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        requestedSchool: 'someSchool',
        isApproved: true,
        role: 'teacher',
      }),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'teacher@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(doSignInWithEmailAndPassword).toHaveBeenCalledWith(
        'teacher@example.com',
        'pass123'
      )
    )
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/teacherhome')
    )
  })

  it('redirects parent to /home after successful login', async () => {
    doSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u2' } })
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        requestedSchool: 'someSchool',
        isApproved: true,
        role: 'parent',
      }),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'parent@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'pass456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    )
  })

  it('redirects to /schoolselection if requestedSchool is null', async () => {
    doSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u3' } })
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        requestedSchool: null,
      }),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'denied@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'pass789' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/schoolselection')
    )
  })

  it('redirects to /pendingapproval if isApproved is false', async () => {
    doSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u4' } })
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        requestedSchool: 'someSchool',
        isApproved: false,
      }),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'pending@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'pass000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/pendingapproval')
    )
  })

  it('displays error message on sign-in failure', async () => {
    doSignInWithEmailAndPassword.mockRejectedValue(
      new Error('Invalid credentials')
    )

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'bad@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })
})



