import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../components/Login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login onLogin={() => {}} />);

    expect(screen.getByText('GitHub Rate Limit Viewer')).toBeInTheDocument();
    expect(screen.getByLabelText('Personal Access Token')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows instructions when toggle is clicked', async () => {
    const user = userEvent.setup();

    render(<Login onLogin={() => {}} />);

    const toggle = screen.getByText(/how to get a token/i);
    await user.click(toggle);

    expect(screen.getByText('Creating a Personal Access Token')).toBeInTheDocument();
  });
});
