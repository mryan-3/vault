"use client";

import { runIntegrationTest } from "@/lib/integration-test";
import { useState } from "react";

export default function Home() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const startTest = async () => {
    setIsRunning(true);
    setTestResult("Running test...");
    const success = await runIntegrationTest();
    setTestResult(success ? "TEST PASSED! Check console for details." : "TEST FAILED! Check console for details.");
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-white font-sans text-black">
      <main className="flex flex-col items-center gap-8 p-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Vault E2EE Engine Test</h1>
        <p className="text-lg text-zinc-600">
          This page allows you to verify the cryptographic and API integration before we build the full UI.
        </p>
        
        <button 
          onClick={startTest}
          disabled={isRunning}
          className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-zinc-800 disabled:bg-zinc-400 transition-all"
        >
          {isRunning ? "Testing..." : "Run Engine Integration Test"}
        </button>

        {testResult && (
          <div className={`p-4 rounded-lg border ${testResult.includes("PASSED") ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {testResult}
          </div>
        )}

        <div className="mt-8 text-sm text-zinc-400">
          Open the browser console (F12) to see the step-by-step logs.
        </div>
      </main>
    </div>
  );
}
