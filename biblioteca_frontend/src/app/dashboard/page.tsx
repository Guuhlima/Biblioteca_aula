"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCases } from "@/lib/di/container";
import { Button } from "@/ui/components/Button";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await useCases.auth.getSession();
        if (!session) {
          router.replace("/login");
          return;
        }
        if (active) setUserName(session.user.nome);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [router]);

  if (loading) return <div className="p-6">Verificando sessão…</div>;

  async function handleLogout() {
    await useCases.auth.logout();
    router.replace("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2">Bem-vindo, {userName}!</p>
      <div className="mt-4">
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    </div>
  );
}
