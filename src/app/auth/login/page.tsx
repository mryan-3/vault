"use client";

import { useState } from "react";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, privateKey } = await authService.login(username, password);
      await setSession(data.user, data.access_token, privateKey);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream text-espresso">
      <div className="w-full max-w-sm space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-crimson">
            <ShieldCheck size={32} weight="fill" />
            <span className="text-xl font-bold tracking-tighter uppercase">Vault</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-[0.9]">Welcome<br/>back</h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-4">
            <Input label="Username" placeholder="alice_92" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm font-medium text-crimson">{error}</p>}
          <Button type="submit" className="w-full" isLoading={loading}>Enter Vault</Button>
        </form>

        <footer className="text-center">
          <p className="text-sm font-medium text-espresso/60">
            No account?{" "}
            <Link href="/auth/register" className="text-espresso hover:underline underline-offset-4 decoration-crimson">
              Create one
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
