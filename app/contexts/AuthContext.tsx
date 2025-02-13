"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  username: string;
  role: "user" | "doctor";
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: "user" | "doctor") => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      const { user, token } = await response.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
    } else {
      throw new Error('Login failed');
    }
  };

  const signup = async (username: string, password: string, role: "user" | "doctor") => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (response.ok) {
      const { user, token } = await response.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
    } else {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};