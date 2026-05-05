"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockKey } from "@phosphor-icons/react";

export default function UnlockPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, updatePrivateKey, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth/login");
  }, [isAuthenticated, router]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const privateKey = await authService.unlock(user, password);
      updatePrivateKey(privateKey);
      router.push("/");
    } catch (err: any) {
      setError("Incorrect master password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream text-espresso text-center">
      <div className="w-full max-w-sm space-y-12">
        <header className="space-y-6">
          <div className="flex justify-center text-crimson animate-pulse">
            <LockKey size={48} weight="duotone" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Unlock Vault</h1>
            <p className="text-espresso/60 font-medium">
              Hello, {user?.display_name}. Enter your master password to decrypt your messages.
            </p>
          </div>
        </header>

        <form onSubmit={handleUnlock} className="space-y-8">
          <Input type="password" placeholder="Master Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="text-center" />
          {error && <p className="text-sm font-medium text-crimson">{error}</p>}
          <Button type="submit" className="w-full" isLoading={loading}>Decrypt</Button>
        </form>
      </div>
    </div>
  );
}
