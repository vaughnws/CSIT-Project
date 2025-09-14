import '@testing-library/jest-dom';

// Mock Stack Auth hooks and components
jest.mock('@stackframe/stack', () => {
  return {
    StackProvider: ({ children }) => children,
    useStackApp: jest.fn(() => ({
      signInWithOAuth: jest.fn().mockResolvedValue({}),
      signInWithCredential: jest.fn().mockResolvedValue({ user: { id: 'test123' } }),
      signUpWithCredential: jest.fn().mockResolvedValue({ user: { id: 'test123' } }),
      signOut: jest.fn().mockResolvedValue({}),
    })),
    useUser: jest.fn(() => null), // or mock user object
  };
});

jest.mock('@stackframe/stack/server', () => {
  return {
    StackServerApp: jest.fn().mockImplementation(() => ({
      getUser: jest.fn().mockResolvedValue({
        id: 'test123',
        primaryEmail: 'test@example.com',
        displayName: 'Test User'
      }),
    })),
  };
});

// Mock fetch for API calls
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ 
    id: 'mock_id', 
    email: 'mock@user.com', 
    name: 'Mock User',
    role: 'student',
    created_at: new Date().toISOString()
  }),
});