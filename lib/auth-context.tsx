'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | { email: string; displayName: string } | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  demoLogin: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | { email: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage demo session fallback
    if (typeof window !== "undefined") {
      const localDemoUser = localStorage.getItem("demo_admin_user");
      if (localDemoUser) {
        try {
          setUser(JSON.parse(localDemoUser));
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem("demo_admin_user");
        }
      }
    }

    if (!isFirebaseConfigured || auth === null) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth!, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim();
    if (isFirebaseConfigured && auth !== null) {
      try {
        await signInWithEmailAndPassword(auth!, cleanEmail, pass);
        return true;
      } catch (err: unknown) {
        console.warn("Firebase auth login attempt failed for:", cleanEmail, err);
      }
    }

    // Demo admin login fallback for testing
    if (email === "admin@example.com" && pass === "admin123") {
      const demoUser = { email: "admin@example.com", displayName: "Admin User" };
      setUser(demoUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("demo_admin_user", JSON.stringify(demoUser));
      }
      return true;
    }
    return false;
  };

  const demoLogin = () => {
    const demoUser = { email: "admin@example.com", displayName: "Admin User" };
    setUser(demoUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_admin_user", JSON.stringify(demoUser));
    }
    router.push("/admin");
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth !== null) {
      try {
        await signOut(auth!);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_admin_user");
    }
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
