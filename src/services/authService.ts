import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const authService = {
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.log('Login popup closed by user.');
      } else {
        console.error('Login error:', error);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};
