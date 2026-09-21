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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | { email: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage session fallback
    if (typeof window !== "undefined") {
      const localAdminUser = localStorage.getItem("admin_user");
      if (localAdminUser) {
        try {
          setUser(JSON.parse(localAdminUser));
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem("admin_user");
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
    const cleanEmail = email.trim().toLowerCase();
    
    // Check mandatory admin credentials: dfadha1923@gmail.com / 11
    if (cleanEmail === "dfadha1923@gmail.com" && pass === "11") {
      const adminUser = { email: "dfadha1923@gmail.com", displayName: "Adha Dwi Fathur" };
      setUser(adminUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
      }
      return true;
    }

    if (isFirebaseConfigured && auth !== null) {
      try {
        await signInWithEmailAndPassword(auth!, cleanEmail, pass);
        return true;
      } catch (err: unknown) {
        console.warn("Firebase auth login attempt failed for:", cleanEmail, err);
      }
    }

    return false;
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
      localStorage.removeItem("admin_user");
    }
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
