import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import type {AccountData} from "@/firebase/auth/type.ts";
import {fetchAccountData} from "@/firebase/auth";

interface AuthContextValue {
  account: AccountData | null;
  loading: boolean;
  error: Error | null;
}
const AccountContext = createContext<AuthContextValue | null>(
    null
);

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AuthProvider : React.FC<AccountProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // onAuthStateChanged fires once immediately with the current user,
    // then again on every sign-in / sign-out.
    const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setError(null);

          if (!firebaseUser) {
            setAccount(null);
            setLoading(false);
            return;
          }

          try {
            // Extend auth data with your Firestore profile fields
            const data = await fetchAccountData(firebaseUser);
            setAccount(data);
          } catch (err) {
            console.error("[AccountProvider] Failed to fetch account data:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
            setAccount(null); // account is null on failure
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          // Auth observer itself errored (e.g. network issue)
          console.error("[AccountProvider] Auth observer error:", err);
          setError(err);
          setAccount(null);
          setLoading(false);
        }
    );


    return unsubscribe; // Cleans up the listener on unmount
  }, []);

  return (
      <AccountContext.Provider value={{ account, loading, error }}>
        {children}
      </AccountContext.Provider>
  );
}

// Hook

/**
 * Access the current account anywhere inside <AccountProvider>.
 *
 * @example
 * const { account, loading, error } = useAccount();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccount must be used within an <AuthProvider>");
  }
  return ctx;
}