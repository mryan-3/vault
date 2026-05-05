"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types/auth";
import { set, get, del } from "idb-keyval";

interface AuthContextType extends AuthState {
  setSession: (user: User, token: string, privateKey: CryptoKey) => Promise<void>;
  logout: () => void;
  updatePrivateKey: (key: CryptoKey) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "wb_access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    privateKey: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = await get<User>("wb_user");

      if (!token || !user) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        privateKey: null, // Still null until unlocked with password
      });
    };

    initAuth();
  }, []);

  const setSession = async (user: User, token: string, privateKey: CryptoKey | null) => {
    localStorage.setItem(TOKEN_KEY, token);
    await set("wb_user", user);
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      privateKey,
    });
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    await del("wb_user");
    
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      privateKey: null,
    });
  };

  const updatePrivateKey = (key: CryptoKey) => {
    setState((s) => ({ ...s, privateKey: key }));
  };

  return (
    <AuthContext.Provider value={{ ...state, setSession, logout, updatePrivateKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
