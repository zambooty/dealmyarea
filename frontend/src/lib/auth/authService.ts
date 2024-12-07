import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async signUp(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async signInWithGoogle() {
    try {
      console.log('Starting Google sign in...');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result.user.email);
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { 
        user: null, 
        error: new Error(error.message || 'Failed to sign in with Google') 
      };
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: new Error(error.message || 'Failed to sign out') };
    }
  },
}; 