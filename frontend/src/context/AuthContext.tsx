import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { type IUser } from "../types";
import { signinApi, signupApi, logoutApi } from "../api/authApi";
import toast from "react-hot-toast";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("frext_token");
    const storedUser = localStorage.getItem("frext_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signinApi({ email, password });
      if (res.data.success && res.data.value) {
        const { user: loggedInUser, token: newToken } = res.data.value;
        localStorage.setItem("frext_token", newToken);
        localStorage.setItem("frext_user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setToken(newToken);
        toast.success("Welcome back!");
        return true;
      }
      toast.error(res.data.message || "Login failed");
      return false;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Login failed");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await signupApi({ name, email, password, role: role as any });
      if (res.data.success) {
        toast.success("Account created. Please sign in.");
        return true;
      }
      toast.error(res.data.message || "Signup failed");
      return false;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Signup failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem("frext_token");
      localStorage.removeItem("frext_user");
      setUser(null);
      setToken(null);
      toast.success("Logged out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
