"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the User type based on Backend DTO
export interface User {
  id: string;
  mail: string;
  username: string | null;
  avatarUrl: string | null;
  name: string;
  lastName: string;
  isVerified: boolean;
  role: string;
}

export interface Professional {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  avatarURL: string;
  description: string;
  whatsappContact: string;
  area: Array<{
    id: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    isMain: boolean;
  }>;
  fields: Array<{
    id: string;
    name: string;
    isMain: boolean;
  }>;
}

interface Verification {
  id: string;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  professional: Professional | null | undefined; // undefined: not checked, null: not found/error
  verification: Verification | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>; // Triggers the fetch user logic
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchProfessional: () => Promise<void>;
  fetchVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [professional, setProfessional] = useState<
    Professional | null | undefined
  >(undefined);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfessional = async () => {
    try {
      const res = await fetch("/api/profile/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProfessional(data.data);
        } else {
          setProfessional(null);
        }
      } else {
        setProfessional(null);
      }
    } catch (error) {
      console.error("Error fetching professional profile:", error);
      setProfessional(null);
    }
  };

  const fetchVerification = async () => {
    try {
      const res = await fetch("/api/verify/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Backend returns the verification object directly or null/empty
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          setVerification(data);
        } else {
          setVerification(null);
        }
      } else {
        setVerification(null);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
      setVerification(null);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        // The backend returns { data: User, success: boolean }
        if (data.success && data.data) {
          setUser(data.data);
          // Also fetch professional data if user exists
          await fetchProfessional();
          await fetchVerification();
        } else {
          setUser(null);
          setProfessional(undefined);
        }
      } else {
        setUser(null);
        setProfessional(undefined);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setProfessional(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    await fetchUser();
    await fetchProfessional();
    await fetchVerification();
  };

  const logout = async () => {
    try {
      console.log("Iniciando logout...");
      const response = await fetch("/api/auth/logout", { method: "POST" });
      console.log("Respuesta del logout:", response.status);

      if (!response.ok) {
        console.error("Error en logout:", await response.text());
      }
    } catch (error) {
      console.error("Error durante logout:", error);
    } finally {
      console.log("Limpiando usuario y redirigiendo...");
      setUser(null);
      setProfessional(undefined);
      setVerification(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        professional,
        verification,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: fetchUser,
        fetchProfessional,
        fetchVerification,
      }}
    >
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
