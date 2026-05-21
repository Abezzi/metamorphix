import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import useAuth from '@/utils/hooks/useAuth';

// Mock the custom hook
vi.mock('@/utils/hooks/useAuth');

const mockSignUp = vi.fn();

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      signUp: mockSignUp,
    });
  });

  const renderComponent = (props: any = {}) => {
    return render(
      <BrowserRouter>
        <SignUpForm {...props} />
      </BrowserRouter>
    );
  };

  it('renders all form fields and submit button', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('User Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  // it('shows validation errors when submitting empty form', async () => {
  //   const user = userEvent.setup();
  //   renderComponent();
  //
  //   await user.click(screen.getByRole('button', { name: /sign up/i }));
  //
  //   await waitFor(() => {
  //     expect(screen.getByText(/Please enter your user name/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Please enter your email/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Please enter your password/i)).toBeInTheDocument();
  //   });
  // });

  it('validates password confirmation mismatch', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByPlaceholderText('User Name'), 'testuser');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'WrongPass123!');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Your passwords do not match')).toBeInTheDocument();
    });
  });

  // it('calls signUp with correct values on successful submission', async () => {
  //   const user = userEvent.setup();
  //   mockSignUp.mockResolvedValue({ status: 'success' });
  //
  //   renderComponent();
  //
  //   await user.type(screen.getByPlaceholderText('User Name'), 'insomnia');
  //   await user.type(screen.getByPlaceholderText('Email'), 'insomnia@test.com');
  //   await user.type(screen.getByPlaceholderText('Password'), '123123123');
  //   await user.type(screen.getByPlaceholderText('Confirm Password'), '123123123');
  //
  //   const submitButton = screen.getByRole('button', { name: /sign up/i });
  //   await user.click(submitButton);
  //
  //   await waitFor(() => {
  //     expect(mockSignUp).toHaveBeenCalledWith({
  //       username: 'insomnia',
  //       email: 'insomnia@test.com',
  //       password: '123123123',
  //     });
  //   });
  //
  //   expect(submitButton).toHaveTextContent('Creating Account...');
  // });

  // it('displays backend error message when signUp fails', async () => {
  //   const user = userEvent.setup();
  //   mockSignUp.mockResolvedValue({
  //     status: 'failed',
  //     message: 'user already exists',
  //   });
  //
  //   renderComponent();
  //
  //   await user.type(screen.getByPlaceholderText('User Name'), 'insomnia');
  //   await user.type(screen.getByPlaceholderText('Email'), 'insomnia@test.com');
  //   await user.type(screen.getByPlaceholderText('Password'), '123123123');
  //   await user.type(screen.getByPlaceholderText('Confirm Password'), '123123123');
  //
  //   await user.click(screen.getByRole('button', { name: /sign up/i }));
  //
  //   await waitFor(() => {
  //     expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
  //   });
  // });

  it('respects disableSubmit prop', async () => {
    const user = userEvent.setup();
    renderComponent({ disableSubmit: true });

    await user.type(screen.getByPlaceholderText('User Name'), 'testuser');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('uses default initial values', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('User Name')).toHaveValue('admin1');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@testmail.com');
  });
});
