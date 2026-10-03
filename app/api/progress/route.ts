import { NextRequest, NextResponse } from "next/server";
import { getProgress, saveProgress, getLeaderboard } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const playerId = request.nextUrl.searchParams.get("playerId");
  const leaderboard = request.nextUrl.searchParams.get("leaderboard");

  if (leaderboard === "true") {
    const top = await getLeaderboard(60);
    return NextResponse.json({ leaderboard: top });
  }

  if (!playerId) {
    return NextResponse.json({ error: "playerId é obrigatório" }, { status: 400 });
  }

  const progress = await getProgress(playerId);
  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerId, playerName, completedChallenges, totalXp } = body;

  if (!playerId || !playerName) {
    return NextResponse.json({ error: "playerId e playerName são obrigatórios" }, { status: 400 });
  }

  await saveProgress(playerId, {
    playerName,
    completedChallenges: completedChallenges ?? [],
    totalXp: totalXp ?? 0,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
