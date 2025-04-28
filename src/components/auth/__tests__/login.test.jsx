import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login';
import { useAuth } from '../../../contexts/authContext';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';

// 🛠️ MOCK the useAuth and Firebase sign-in
jest.mock('../../../contexts/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../firebase/auth', () => ({
  doSignInWithEmailAndPassword: jest.fn(),
}));

// ✅ Setup
describe('Login Page', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ userLoggedIn: false });
  });

  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to type email and password and submit', async () => {
    doSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-user-id' },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Simulate typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submit
    fireEvent.click(submitButton);

    // Wait for async operations
    await waitFor(() => {
      expect(doSignInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message if login fails', async () => {
    doSignInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

