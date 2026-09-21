import { createContext, useContext, useEffect, useState } from "react";
import type { UserResponse } from "../types/api";
import { getCurrentUser, loginUser, logoutUser } from "../services/auth.api";
import { subscribeToPush } from "../services/push";

interface AuthContextType {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await getCurrentUser();
        setUser(result.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    subscribeToPush().catch((error) => {
      console.error("Push subscription failed:", error);
    });
  }, [user]);

  async function login(email: string, password: string) {
    const result = await loginUser({
      email,
      password,
    });

    setUser(result.user);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
