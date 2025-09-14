
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// Mock StackClientApp
const mockGetUser = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@stackframe/react', () => {
  return {
    StackClientApp: jest.fn().mockImplementation(() => ({
      getUser: mockGetUser,
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
    })),
  };
});

// Mock fetch for DB sync
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'user123', email: 'test@stack.com', name: 'Test User' }),
  })
);

// Test component
const TestComponent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div>
      {loading ? 'loading' : isAuthenticated ? `user:${user.email}` : 'not-authenticated'}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('initializes Stack Auth and detects no user', async () => {
    mockGetUser.mockReturnValue(null);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByText('not-authenticated')).toBeInTheDocument());
    expect(mockGetUser).toHaveBeenCalled();
  });

  test('detects existing user after OAuth redirect', async () => {
    mockGetUser.mockReturnValue({
      id: 'stack123',
      primaryEmail: 'stack@user.com',
      displayName: 'Stack User',
      session: { accessToken: 'token123' },
    });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByText('user:stack@user.com')).toBeInTheDocument());
    expect(mockGetUser).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/auth/sync-user', expect.any(Object));
  });

  test('handles demo user login fallback', async () => {
    localStorage.setItem('current_user', JSON.stringify({ id: 'demo123', email: 'demo@rrc.ca' }));

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByText('user:demo@rrc.ca')).toBeInTheDocument());
  });

  test('signInWithOAuth triggers Stack SDK and syncs DB', async () => {
    mockSignInWithOAuth.mockImplementation(() => {
      mockGetUser.mockReturnValue({
        id: 'oauth123',
        primaryEmail: 'oauth@stack.com',
        displayName: 'OAuth User',
        session: { accessToken: 'token123' },
      });
    });

    const Wrapper = () => {
      const { signInWithGoogle, user, isAuthenticated } = useAuth();
      React.useEffect(() => {
        signInWithGoogle();
      }, []);
      return <div>{isAuthenticated ? `user:${user.email}` : 'not-authenticated'}</div>;
    };

    const { getByText } = render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>
    );

    await waitFor(() => expect(getByText('user:oauth@stack.com')).toBeInTheDocument());
    expect(mockSignInWithOAuth).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/auth/sync-user', expect.any(Object));
  });
});