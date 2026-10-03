// Em produção (Vercel), as variáveis KV_REST_API_URL e KV_REST_API_TOKEN
// são criadas automaticamente ao conectar um banco Vercel KV (Redis) ao projeto.
// Localmente, se essas variáveis não existirem, o app cai num armazenamento
// em memória (os dados se perdem ao reiniciar o servidor), só para testes.

type ProgressRecord = {
  playerName: string;
  completedChallenges: string[];
  totalXp: number;
  updatedAt: string;
};

const memoryStore = new Map<string, ProgressRecord>();

const hasKvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function getKv() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getProgress(playerId: string): Promise<ProgressRecord | null> {
  if (!hasKvConfigured) {
    return memoryStore.get(playerId) ?? null;
  }
  const kv = await getKv();
  const data = await kv.get<ProgressRecord>(`progress:${playerId}`);
  return data ?? null;
}

export async function saveProgress(playerId: string, record: ProgressRecord): Promise<void> {
  if (!hasKvConfigured) {
    memoryStore.set(playerId, record);
    return;
  }
  const kv = await getKv();
  await kv.set(`progress:${playerId}`, record);
}

export async function getLeaderboard(limit = 60): Promise<ProgressRecord[]> {
  if (!hasKvConfigured) {
    return Array.from(memoryStore.values())
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, limit);
  }
  const kv = await getKv();
  const keys = await kv.keys("progress:*");
  const records = await Promise.all(keys.map((k) => kv.get<ProgressRecord>(k)));
  return records
    .filter((r): r is ProgressRecord => Boolean(r))
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, limit);
}

export const isUsingRealRedis = hasKvConfigured;
