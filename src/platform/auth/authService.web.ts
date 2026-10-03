import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { firebaseApp } from '@/services/firebase';
import type { AuthService } from './auth.types';
import type { AuthErrorCode, AuthResult, AuthUser, Unsubscribe } from '@/core/types';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function toAuthUser(user: any): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
  };
}

function mapErrorCode(error: any): AuthErrorCode {
  const code = error?.code as string | undefined;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'invalid-credential';
    case 'auth/email-already-in-use':
      return 'email-already-in-use';
    case 'auth/weak-password':
      return 'weak-password';
    case 'auth/network-request-failed':
      return 'network';
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      return 'cancelled';
    default:
      return 'unknown';
  }
}

export const authService: AuthService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    return user ? toAuthUser(user) : null;
  },

  onAuthStateChanged(
    listener: (user: AuthUser | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return firebaseOnAuthStateChanged(
      auth,
      (user) => listener(user ? toAuthUser(user) : null),
      (error) => onError?.(error)
    );
  },

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { status: 'success', user: toAuthUser(res.user) };
    } catch (error: any) {
      return {
        status: 'error',
        code: mapErrorCode(error),
        message: error?.message ?? 'Failed to sign in',
      };
    }
  },

  async registerWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return { status: 'success', user: toAuthUser(res.user) };
    } catch (error: any) {
      return {
        status: 'error',
        code: mapErrorCode(error),
        message: error?.message ?? 'Failed to register',
      };
    }
  },

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return { status: 'success', user: toAuthUser(res.user) };
    } catch (error: any) {
      return {
        status: 'error',
        code: mapErrorCode(error),
        message: error?.message ?? 'Failed to sign in with Google',
      };
    }
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async updateProfile(patch: {
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;
    await firebaseUpdateProfile(user, {
      displayName: patch.displayName ?? undefined,
      photoURL: patch.photoURL ?? undefined,
    });
  },
};
