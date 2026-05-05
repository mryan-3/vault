import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-cream text-espresso flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <header className="flex flex-col items-center gap-6">
          <div className="text-crimson">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-crimson/40">Vault</h1>
        </header>

        <main className="space-y-6">
          <h2 className="text-7xl font-bold tracking-tight leading-[0.85] text-balance">
            Where your secrets <br /> find a home.
          </h2>
          <p className="text-lg font-medium text-espresso/50 max-w-md mx-auto leading-relaxed">
            End-to-end encrypted messaging designed for absolute digital sovereignty. 
            Zero-knowledge security that keeps your conversations truly private.
          </p>
        </main>

        <footer className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-48 text-lg py-6 rounded-xl">Get Started</Button>
          </Link>
          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-48 text-lg py-6 rounded-xl border-espresso/10 hover:bg-espresso/5">
              Sign In
            </Button>
          </Link>
        </footer>
      </div>
      
      {/* Background decoration - very subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/5 rounded-full blur-[120px] -z-10 opacity-30" />
    </div>
  );
}
