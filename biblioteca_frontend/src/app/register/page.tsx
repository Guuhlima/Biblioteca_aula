"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCases } from "@/lib/di/container";
import { fetchClient } from "@/lib/http/HttpClient";
import { Input } from "@/ui/components/Input";
import { Button } from "@/ui/components/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await fetchClient.post("/users", { nome, email, password });
      await useCases.auth.login(email, password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Falha ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm rounded-lg border p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">Cadastre-se</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button disabled={loading} type="submit">Criar conta</Button>
      </form>
      <p className="mt-3 text-sm">
        Já tem conta? <a className="underline" href="/login">Entrar</a>
      </p>
    </div>
  );
}
