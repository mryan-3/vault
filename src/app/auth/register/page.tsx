"use client";

import { useState } from "react";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldPlus } from "@phosphor-icons/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", displayName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.register(formData.username, formData.displayName, formData.password);
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream text-espresso">
      <div className="w-full max-w-sm space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-crimson">
            <ShieldPlus size={32} weight="fill" />
            <span className="text-xl font-bold tracking-tighter uppercase">Vault</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-[0.9]">Secure<br/>Access</h1>
        </header>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-4">
            <Input label="Username" placeholder="bob_99" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <Input label="Display Name" placeholder="Bob" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} required />
            <Input label="Master Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          {error && <p className="text-sm font-medium text-crimson">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>Initialize Vault</Button>
        </form>

        <footer className="text-center">
          <p className="text-sm font-medium text-espresso/60">
            Already a member?{" "}
            <Link href="/auth/login" className="text-espresso hover:underline underline-offset-4 decoration-crimson">
              Log in
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
