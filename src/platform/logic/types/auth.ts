export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type Unsubscribe = () => void;

export type AuthErrorCode =
  | 'invalid-credential'
  | 'email-already-in-use'
  | 'weak-password'
  | 'user-not-found'
  | 'network'
  | 'cancelled'
  | 'unknown';

export type AuthResult =
  | { status: 'success'; user: AuthUser }
  | { status: 'error'; code: AuthErrorCode; message: string };
