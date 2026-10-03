"use client";

import { useState } from "react";
import Link from "next/link";
import { challenges } from "@/lib/challenges";
import { selectorChallenges } from "@/lib/selector-challenges";
import { usePlayer } from "@/lib/usePlayer";
import Progress from "@/components/Progress/Progress";

export default function HomePage() {
  const { playerName, setPlayerName, completedChallenges, totalXp } = usePlayer();
  const [nameInput, setNameInput] = useState("");

  const modulo1Completo = selectorChallenges.every((c) => completedChallenges.includes(c.id));
  const totalFases = selectorChallenges.length + challenges.length;
  const completasTotal = completedChallenges.length;

  if (!playerName) {
    return (
      <main className="min-h-screen bg-[#14291c] flex items-center justify-center px-6">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center">
          <h1 className="text-2xl font-bold text-[#3F6B1D] mb-2">CSS Quest</h1>
          <p className="text-gray-600 mb-6">Como você quer ser chamado no jogo?</p>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Seu nome"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 outline-none focus:border-[#5F922F]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameInput.trim()) setPlayerName(nameInput.trim());
            }}
          />
          <button
            onClick={() => nameInput.trim() && setPlayerName(nameInput.trim())}
            className="w-full bg-[#1f4d2c] text-white rounded-full py-2 font-semibold hover:bg-[#2c6b3d] transition"
          >
            Começar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4ee] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3F6B1D]">CSS Quest</h1>
            <p className="text-gray-600 text-sm">Olá, {playerName}</p>
          </div>
        </div>

        <Progress completedCount={completasTotal} totalXp={totalXp} total={totalFases} />

        {/* MÓDULO 1: SELETORES */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#3F6B1D] mb-1">Módulo 1 · Seletores</h2>
          <p className="text-sm text-gray-500 mb-3">Aprenda a escolher exatamente qual elemento estilizar</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {selectorChallenges.map((c, i) => {
              const isCompleted = completedChallenges.includes(c.id);
              const isUnlocked = i === 0 || completedChallenges.includes(selectorChallenges[i - 1].id);

              if (!isUnlocked) {
                return (
                  <div key={c.id} className="aspect-square rounded-xl bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-2xl">🔒</span>
                    <span className="text-xs mt-1">Fase {c.order}</span>
                  </div>
                );
              }
              return (
                <Link
                  key={c.id}
                  href={`/selecao/${c.order}`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 transition hover:scale-[1.03] ${
                    isCompleted ? "bg-[#5F922F] text-white" : "bg-white border-2 border-[#E8B339] text-[#3F6B1D]"
                  }`}
                >
                  <span className="text-2xl">{isCompleted ? "✓" : "▶"}</span>
                  <span className="text-xs font-semibold mt-1">Fase {c.order}</span>
                  <span className="text-[11px] mt-0.5">{c.type}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* MÓDULO 2: PROPRIEDADES */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-[#3F6B1D] mb-1">Módulo 2 · Propriedades</h2>
          <p className="text-sm text-gray-500 mb-3">
            {modulo1Completo ? "Vista o personagem com CSS" : "Complete o Módulo 1 inteiro para desbloquear"}
          </p>

          {!modulo1Completo && (
            <div className="rounded-xl bg-gray-200 p-6 text-center text-gray-500">
              <span className="text-3xl block mb-2">🔒</span>
              Termine todas as 10 fases do Módulo 1 primeiro
            </div>
          )}

          {modulo1Completo && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {challenges.map((c, i) => {
                const isCompleted = completedChallenges.includes(c.id);
                const isUnlocked = i === 0 || completedChallenges.includes(challenges[i - 1].id);

                if (!isUnlocked) {
                  return (
                    <div key={c.id} className="aspect-square rounded-xl bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                      <span className="text-2xl">🔒</span>
                      <span className="text-xs mt-1">Fase {c.order}</span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={c.id}
                    href={`/jogo/${c.order}`}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 transition hover:scale-[1.03] ${
                      isCompleted ? "bg-[#5F922F] text-white" : "bg-white border-2 border-[#E8B339] text-[#3F6B1D]"
                    }`}
                  >
                    <span className="text-2xl">{isCompleted ? "✓" : "▶"}</span>
                    <span className="text-xs font-semibold mt-1">Fase {c.order}</span>
                    <span className="text-[11px] mt-0.5">{c.property}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
