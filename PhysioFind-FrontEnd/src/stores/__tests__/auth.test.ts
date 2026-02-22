import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import type { User, Session } from '@supabase/supabase-js'

// MARK: Mock Supabase

const { mockGetSession, mockOnAuthStateChange, mockSignInWithPassword, mockSignUp, mockSignOut } =
  vi.hoisted(() => ({
    mockGetSession: vi.fn(),
    mockOnAuthStateChange: vi.fn((_cb: (event: string, session: Session | null) => void) => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    mockSignInWithPassword: vi.fn(),
    mockSignUp: vi.fn(),
    mockSignOut: vi.fn(),
  }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  }),
}))

// MARK: Helpers

const fakeUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  aud: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: '2025-01-01T00:00:00Z',
} as User

const fakeSession: Session = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: fakeUser,
} as Session

// MARK: Tests

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // MARK: Initial state

  it('has correct initial state', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.session).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  // MARK: init()

  describe('init', () => {
    let capturedAuthCallback: (event: string, session: Session | null) => void

    beforeEach(() => {
      mockOnAuthStateChange.mockImplementation((cb) => {
        capturedAuthCallback = cb
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      })
    })

    it('restores an existing session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: fakeSession } })

      const store = useAuthStore()
      await store.init()

      expect(store.session).toEqual(fakeSession)
      expect(store.user).toEqual(fakeUser)
      expect(store.isAuthenticated).toBe(true)
    })

    it('handles no existing session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      const store = useAuthStore()
      await store.init()

      expect(store.session).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('registers an auth state change listener', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      const store = useAuthStore()
      await store.init()

      expect(mockOnAuthStateChange).toHaveBeenCalledOnce()
    })

    it('updates state when auth state changes', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      const store = useAuthStore()
      await store.init()

      // Simulate an auth state change via the registered callback
      capturedAuthCallback('SIGNED_IN', fakeSession)

      expect(store.session).toEqual(fakeSession)
      expect(store.user).toEqual(fakeUser)
    })

    it('clears state when auth state changes to signed out', async () => {
      mockGetSession.mockResolvedValue({ data: { session: fakeSession } })

      const store = useAuthStore()
      await store.init()

      capturedAuthCallback('SIGNED_OUT', null)

      expect(store.session).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  // MARK: signIn()

  describe('signIn', () => {
    it('signs in successfully', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })

      const store = useAuthStore()
      await store.signIn('test@example.com', 'password123')

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(store.session).toEqual(fakeSession)
      expect(store.user).toEqual(fakeUser)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('sets error on sign-in failure', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid login credentials' },
      })

      const store = useAuthStore()
      await store.signIn('test@example.com', 'wrong')

      expect(store.error).toBe('Invalid login credentials')
      expect(store.user).toBeNull()
      expect(store.session).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('manages loading state', async () => {
      let resolveSignIn: (value: unknown) => void
      mockSignInWithPassword.mockReturnValue(
        new Promise((resolve) => {
          resolveSignIn = resolve
        }),
      )

      const store = useAuthStore()
      const signInPromise = store.signIn('test@example.com', 'password123')

      expect(store.isLoading).toBe(true)

      resolveSignIn!({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })
      await signInPromise

      expect(store.isLoading).toBe(false)
    })

    it('clears previous error on new attempt', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { session: null, user: null },
        error: { message: 'First error' },
      })

      const store = useAuthStore()
      await store.signIn('test@example.com', 'wrong')
      expect(store.error).toBe('First error')

      mockSignInWithPassword.mockResolvedValueOnce({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })
      await store.signIn('test@example.com', 'password123')
      expect(store.error).toBeNull()
    })
  })

  // MARK: signUp()

  describe('signUp', () => {
    it('signs up successfully', async () => {
      mockSignUp.mockResolvedValue({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })

      const store = useAuthStore()
      await store.signUp('new@example.com', 'password123')

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      })
      expect(store.session).toEqual(fakeSession)
      expect(store.user).toEqual(fakeUser)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('sets error on sign-up failure', async () => {
      mockSignUp.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Email already in use' },
      })

      const store = useAuthStore()
      await store.signUp('existing@example.com', 'password123')

      expect(store.error).toBe('Email already in use')
      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('handles null session on sign-up (email confirmation required)', async () => {
      mockSignUp.mockResolvedValue({
        data: { session: null, user: fakeUser },
        error: null,
      })

      const store = useAuthStore()
      await store.signUp('new@example.com', 'password123')

      expect(store.session).toBeNull()
      expect(store.user).toEqual(fakeUser)
      expect(store.error).toBeNull()
    })

    it('manages loading state', async () => {
      let resolveSignUp: (value: unknown) => void
      mockSignUp.mockReturnValue(
        new Promise((resolve) => {
          resolveSignUp = resolve
        }),
      )

      const store = useAuthStore()
      const signUpPromise = store.signUp('new@example.com', 'password123')

      expect(store.isLoading).toBe(true)

      resolveSignUp!({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })
      await signUpPromise

      expect(store.isLoading).toBe(false)
    })
  })

  // MARK: signOut()

  describe('signOut', () => {
    it('signs out successfully', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: fakeSession, user: fakeUser },
        error: null,
      })
      mockSignOut.mockResolvedValue({ error: null })

      const store = useAuthStore()
      await store.signIn('test@example.com', 'password123')
      await store.signOut()

      expect(store.session).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('sets error on sign-out failure', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Network error' },
      })

      const store = useAuthStore()
      await store.signOut()

      expect(store.error).toBe('Network error')
      expect(store.isLoading).toBe(false)
    })

    it('manages loading state', async () => {
      let resolveSignOut: (value: unknown) => void
      mockSignOut.mockReturnValue(
        new Promise((resolve) => {
          resolveSignOut = resolve
        }),
      )

      const store = useAuthStore()
      const signOutPromise = store.signOut()

      expect(store.isLoading).toBe(true)

      resolveSignOut!({ error: null })
      await signOutPromise

      expect(store.isLoading).toBe(false)
    })
  })
})
