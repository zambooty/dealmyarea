import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  AuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  updateProfile as firebaseUpdateProfile,
  getIdToken,
  AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, githubProvider, twitterProvider, initialize } from '../firebase';

export type SocialProvider = 'google' | 'facebook' | 'github' | 'twitter';

const providerMap = {
  google: googleProvider,
  facebook: facebookProvider,
  github: githubProvider,
  twitter: twitterProvider
};

// Error message mapping
const getErrorMessage = (error: AuthError) => {
  const code = (error.code || '').replace('auth/', '') as string;
  
  switch (code) {
    case 'network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'popup-closed-by-user':
      return 'Sign in cancelled. Please try again.';
    case 'popup-blocked':
      return 'Pop-up blocked by browser. Please allow pop-ups for this site.';
    case 'account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.';
    case 'invalid-password':
      return 'Invalid password. Please try again.';
    case 'user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'invalid-email':
      return 'Invalid email address. Please check and try again.';
    case 'email-already-in-use':
      return 'Email already in use. Please try signing in instead.';
    case 'operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    default:
      console.error('Auth error:', error);
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Handle auth token
  const handleAuthToken = async (user: User | null) => {
    if (typeof window === 'undefined') return;

    try {
      if (user) {
        console.log('Getting new ID token...');
        const token = await getIdToken(user, true);
        localStorage.setItem('auth-token', token);
        document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        console.log('Token successfully stored');
      } else {
        console.log('Removing auth token...');
        localStorage.removeItem('auth-token');
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        console.log('Token removed');
      }
    } catch (error) {
      console.error('Error handling auth token:', error);
      // Don't throw here to prevent breaking the auth flow
    }
  };

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initAuth = async () => {
      try {
        console.log('Initializing Firebase auth...');
        // Ensure Firebase is initialized
        if (!initialized) {
          await initialize();
          setInitialized(true);
          console.log('Firebase initialized successfully');
        }

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            setUser(user);
            await handleAuthToken(user);
          } catch (error) {
            console.error('Error in auth state change:', error);
            setError(error instanceof Error ? error.message : 'An error occurred during authentication');
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error setting up auth state listener:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during authentication setup');
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...');
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        throw new Error('Please verify your email before signing in');
      }

      await handleAuthToken(userCredential.user);
      console.log('Sign in successful');
      return userCredential.user;
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Sign in error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      console.log('Attempting sign up...');
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile if display name is provided
      if (displayName) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }
      
      // Send verification email
      await firebaseSendEmailVerification(userCredential.user);
      console.log('Sign up successful, verification email sent');
      
      return userCredential.user;
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Sign up error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  const signInWithSocial = async (provider: SocialProvider) => {
    try {
      console.log(`Attempting ${provider} sign in...`);
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      const authProvider = providerMap[provider];
      const result = await signInWithPopup(auth, authProvider);
      await handleAuthToken(result.user);
      console.log(`${provider} sign in successful`);
      return result.user;
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Social sign in error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out...');
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      await firebaseSignOut(auth);
      await handleAuthToken(null);
      console.log('Sign out successful');
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Sign out error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      console.log('Sending password reset email...');
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      await firebaseSendPasswordReset(auth, email);
      console.log('Password reset email sent');
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Password reset error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      console.log('Resending verification email...');
      if (!initialized) {
        await initialize();
        setInitialized(true);
      }

      setError(null);
      if (!user) throw new Error('No user is currently signed in');
      await firebaseSendEmailVerification(user);
      console.log('Verification email sent');
    } catch (err) {
      const error = err as AuthError;
      const errorMessage = getErrorMessage(error);
      console.error('Verification email error:', error);
      setError(errorMessage);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithSocial,
    sendPasswordReset,
    resendVerificationEmail
  };
} 