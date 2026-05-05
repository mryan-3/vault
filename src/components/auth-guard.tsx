"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, privateKey } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else if (!privateKey) {
        router.replace("/auth/unlock");
      }
    }
  }, [isAuthenticated, isLoading, privateKey, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-pulse rounded-full bg-crimson/20" />
      </div>
    );
  }

  return <>{children}</>;
}
