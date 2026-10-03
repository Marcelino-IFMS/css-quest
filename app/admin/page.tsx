"use client";

import { useEffect, useState } from "react";
import { challenges } from "@/lib/challenges";
import { selectorChallenges } from "@/lib/selector-challenges";
import { levelFromXp } from "@/lib/scoring";

type LeaderboardEntry = {
  playerName: string;
  completedChallenges: string[];
  totalXp: number;
  updatedAt: string;
};

export default function AdminPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState(false);
  const totalModulo1 = selectorChallenges.length;
  const totalModulo2 = challenges.length;

  function contarModulo1(completas: string[]) {
    return completas.filter((id) => id.startsWith("sel-")).length;
  }
  function contarModulo2(completas: string[]) {
    return completas.filter((id) => !id.startsWith("sel-")).length;
  }

  async function carregar() {
    setError(false);
    try {
      const res = await fetch("/api/progress?leaderboard=true");
      const data = await res.json();
      setEntries(data.leaderboard ?? []);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 15000); // atualiza sozinho a cada 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f4ee] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3F6B1D]">Painel do professor</h1>
            <p className="text-gray-600 text-sm">Desempenho dos alunos no CSS Quest</p>
          </div>
          <button
            onClick={carregar}
            className="px-4 py-2 rounded-full bg-[#1f4d2c] text-white text-sm font-semibold hover:bg-[#2c6b3d] transition"
          >
            Atualizar agora
          </button>
        </div>

        {error && (
          <div className="bg-[#fdeceb] border border-[#a3291f] text-[#a3291f] rounded-lg p-4 mb-4 text-sm">
            Não consegui carregar os dados. Confira se o Redis (Vercel KV) está configurado — sem
            ele, cada instância do servidor guarda progresso separado, e esta lista pode vir vazia
            ou incompleta.
          </div>
        )}

        {entries === null && !error && (
          <p className="text-gray-500 text-sm">Carregando...</p>
        )}

        {entries !== null && entries.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum aluno jogou ainda.</p>
        )}

        {entries !== null && entries.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-[#14291c] text-white text-left">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Aluno</th>
                  <th className="px-4 py-3">Módulo 1 (Seletores)</th>
                  <th className="px-4 py-3">Módulo 2 (Propriedades)</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">Pontos totais</th>
                  <th className="px-4 py-3">Última atividade</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const { level } = levelFromXp(entry.totalXp);
                  const m1 = contarModulo1(entry.completedChallenges);
                  const m2 = contarModulo2(entry.completedChallenges);
                  const m1Pct = Math.round((m1 / totalModulo1) * 100);
                  const m2Pct = Math.round((m2 / totalModulo2) * 100);
                  const pronto = m1 === totalModulo1;
                  return (
                    <tr key={entry.playerName + i} className={i % 2 ? "bg-[#F1F6EC]" : "bg-white"}>
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-[#3F6B1D]">
                        {entry.playerName}
                        {pronto && (
                          <span className="ml-2 text-[10px] font-bold uppercase bg-[#E8B339] text-[#14291c] px-2 py-0.5 rounded-full align-middle whitespace-nowrap">
                            pronto p/ competição
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs w-10">{m1}/{totalModulo1}</span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E8B339]" style={{ width: `${m1Pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs w-10">{m2}/{totalModulo2}</span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#5F922F]" style={{ width: `${m2Pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{level}</td>
                      <td className="px-4 py-3 font-mono">{entry.totalXp}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(entry.updatedAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Esta lista mostra até 60 alunos, ordenados por XP. Atualiza sozinha a cada 15 segundos.
        </p>
      </div>
    </main>
  );
}
