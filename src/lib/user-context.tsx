"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type UserRole = "murid" | "guru" | "admin";

export interface UserInfo {
  role: UserRole;
  email: string;

  name: string;

  sub: string;
}

const STORAGE_ROLE_KEY = "lf_role";
const STORAGE_EMAIL_KEY = "lf_email";

const ROLE_SUB: Record<UserRole, string> = {
  admin: "Admin SMK Texar",
  guru: "Guru Bahasa Jepang",
  murid: "Kelas XII RPL 1",
};

export function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "";
  const words = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.length > 0 ? words.join(" ") : "Pengguna";
}

function buildUserInfo(role: UserRole, email: string): UserInfo {
  return {
    role,
    email,
    name: deriveNameFromEmail(email),
    sub: ROLE_SUB[role],
  };
}

interface UserContextValue {

  user: UserInfo | null;

  isLoading: boolean;

  login: (email: string, role: UserRole) => void;

  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem(STORAGE_ROLE_KEY) as UserRole | null;
    const email = localStorage.getItem(STORAGE_EMAIL_KEY);
    if (role && email) {
      setUser(buildUserInfo(role, email));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, role: UserRole) => {
    localStorage.setItem(STORAGE_ROLE_KEY, role);
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
    setUser(buildUserInfo(role, email));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_ROLE_KEY);
    localStorage.removeItem(STORAGE_EMAIL_KEY);
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser() harus dipakai di dalam <UserProvider>");
  }
  return ctx;
}

export function useRoleGuard(requiredRole: UserRole): void {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {

    if (isLoading) return;
    if (!user || user.role !== requiredRole) {
      router.replace("/login");
    }
  }, [isLoading, user, requiredRole, router]);
}
