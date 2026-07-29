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
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "murid" | "guru" | "admin";

export interface UserInfo {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  sub: string;
  schoolId: string | null;
  classId: string | null;
}

const ROLE_SUB: Record<UserRole, string> = {
  admin: "Admin Sekolah",
  guru: "Guru Bahasa Jepang",
  murid: "Murid",
};

function toUserInfo(user: User): UserInfo | null {
  const role = user.user_metadata?.role as UserRole | undefined;
  if (!role) return null;
  const fullName = (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "Pengguna";
  return {
    id: user.id,
    role,
    email: user.email ?? "",
    name: fullName,
    sub: ROLE_SUB[role],
    schoolId: (user.user_metadata?.school_id as string | undefined) ?? null,
    classId: (user.user_metadata?.class_id as string | undefined) ?? null,
  };
}

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  schoolId?: string;
  classId?: string;
}

interface AuthResult {
  error?: string;
  role?: UserRole;
}

interface UserContextValue {
  user: UserInfo | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? toUserInfo(data.user) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toUserInfo(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const role = data.user?.user_metadata?.role as UserRole | undefined;
      return { role };
    },
    [supabase],
  );

  const signUp = useCallback(
    async (input: SignUpInput): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            role: input.role,
            school_id: input.schoolId,
            class_id: input.classId,
          },
        },
      });
      if (error) return { error: error.message };
      return {};
    },
    [supabase],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, isLoading, login, signUp, logout }}>
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
