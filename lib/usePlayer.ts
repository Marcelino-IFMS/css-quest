"use client";

import { useCallback, useEffect, useState } from "react";

const PLAYER_ID_KEY = "css-quest-player-id";
const PLAYER_NAME_KEY = "css-quest-player-name";

function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function usePlayer() {
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerNameState] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    const id = getOrCreatePlayerId();
    setPlayerId(id);
    const storedName = localStorage.getItem(PLAYER_NAME_KEY) ?? "";
    setPlayerNameState(storedName);

    if (!id) return;
    fetch(`/api/progress?playerId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.progress) {
          setCompletedChallenges(data.progress.completedChallenges ?? []);
          setTotalXp(data.progress.totalXp ?? 0);
        }
      })
      .catch(() => {
        // offline ou API indisponivel: segue so com o que tem local
      });
  }, []);

  const setPlayerName = useCallback((name: string) => {
    localStorage.setItem(PLAYER_NAME_KEY, name);
    setPlayerNameState(name);
  }, []);

  const markCompleted = useCallback(
    (challengeId: string, xpEarned: number) => {
      setCompletedChallenges((prev) => {
        const next = prev.includes(challengeId) ? prev : [...prev, challengeId];
        const newTotalXp = totalXp + xpEarned;
        setTotalXp(newTotalXp);

        if (playerId && playerName) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerId,
              playerName,
              completedChallenges: next,
              totalXp: newTotalXp,
            }),
          }).catch(() => {
            // falha ao salvar remoto: o jogo continua funcionando so localmente
          });
        }

        return next;
      });
    },
    [playerId, playerName, totalXp]
  );

  return { playerId, playerName, setPlayerName, completedChallenges, totalXp, markCompleted };
}
