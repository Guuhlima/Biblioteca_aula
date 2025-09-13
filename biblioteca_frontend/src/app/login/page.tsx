"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCases } from "@/lib/di/container";
import { Input } from "@/ui/components/Input";
import { Button } from "@/ui/components/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await useCases.auth.login(email, password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-6 flex items-center gap-3"
          >
            <motion.div
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            >
              <span className="text-2xl">📚</span>
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Bem-vindo de volta</h1>
              <p className="text-sm text-white/60">Entre para acessar sua biblioteca</p>
            </div>
          </motion.div>

          {/* card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="/register" className="text-white/70 underline underline-offset-4 hover:text-white">
                  Criar conta
                </a>
                <a
                  href="#"
                  className="text-white/40 hover:text-white/70 transition"
                  onClick={(e) => e.preventDefault()}
                >
                  Esqueci minha senha
                </a>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button disabled={loading} type="submit">
                  <span className="inline-flex items-center justify-center gap-2">
                    {loading && <Spinner />}
                    {loading ? "Entrando..." : "Entrar"}
                  </span>
                </Button>
              </motion.div>

              <AnimatePresence>
                {err && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
                  >
                    {err}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-6 text-center text-xs text-white/50"
          >
            Protegido com segurança • Fastify + Prisma • SOLID
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden
    />
  );
}

function AnimatedBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.04)_1px)] [background-size:24px_24px]"
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 blur-3xl">
        <div className="h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/40 to-emerald-400/40 animate-blob-slow" />
      </div>
      <div className="pointer-events-none absolute -bottom-40 -left-20 blur-3xl">
        <div className="h-[24rem] w-[24rem] rounded-full bg-gradient-to-tr from-emerald-400/30 via-cyan-500/30 to-blue-500/30 animate-blob-slower" />
      </div>
      <div className="pointer-events-none absolute -bottom-28 -right-20 blur-3xl">
        <div className="h-[20rem] w-[20rem] rounded-full bg-gradient-to-tr from-pink-400/30 via-orange-400/30 to-yellow-300/30 animate-blob-slowest" />
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-20px, 10px) scale(1.05); }
          66% { transform: translate(20px, -10px) scale(0.98); }
        }
        .animate-blob-slow   { animation: blob 16s infinite ease-in-out; }
        .animate-blob-slower { animation: blob 22s infinite ease-in-out; }
        .animate-blob-slowest{ animation: blob 28s infinite ease-in-out; }
      `}</style>
    </>
  );
}
