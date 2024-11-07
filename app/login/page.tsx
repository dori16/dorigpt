"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    } else {
      setError("Password non corretta");
    }
  };

  return (
    <main className="bg-white dark:bg-zinc-900">
      <div className="h-[100dvh] flex items-center justify-center bg-white/30 dark:bg-zinc-900/50 backdrop-blur-md backdrop-saturate-150 relative">
        {/* Blobs decorativi */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md p-6 relative z-10">
          <div className="bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-zinc-800 dark:text-zinc-100">
              Login DoriGPT
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci la password"
                  className="w-full px-4 py-3 rounded-md bg-white/10 dark:bg-zinc-800/30 border border-white/20 dark:border-zinc-800/30 text-zinc-800 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600/90 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 font-medium backdrop-blur-sm"
              >
                Accedi
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 