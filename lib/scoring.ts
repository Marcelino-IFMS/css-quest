export function calculateXp(baseXp: number, secondsTaken: number, hintsUsed: number, attempts: number): number {
  let xp = baseXp;

  // bonus de velocidade: resolveu em menos de 30s, ganha 20% a mais
  if (secondsTaken <= 30) {
    xp = Math.round(xp * 1.2);
  } else if (secondsTaken > 120) {
    // sem penalidade por demorar, so nao ganha o bonus
  }

  // cada dica usada reduz 15% do xp (nunca abaixo de 40% do valor base)
  const hintPenalty = Math.min(hintsUsed * 0.15, 0.6);
  xp = Math.round(xp * (1 - hintPenalty));

  // cada tentativa errada alem da primeira reduz um pouco, ate um minimo
  const attemptPenalty = Math.min(Math.max(attempts - 1, 0) * 0.05, 0.3);
  xp = Math.round(xp * (1 - attemptPenalty));

  return Math.max(xp, Math.round(baseXp * 0.3));
}

/**
 * Pontuação do Módulo 1 (Seletores), na mesma fórmula do jogo original:
 * começa em 100, perde 1 ponto por segundo e 15 por tentativa errada, nunca abaixo de 20.
 */
export function calculateSelectorPoints(elapsedSeconds: number, wrongAttempts: number): number {
  const pts = 100 - Math.floor(elapsedSeconds) - wrongAttempts * 15;
  return Math.max(20, pts);
}

export function levelFromXp(totalXp: number): { level: number; xpIntoLevel: number; xpForNextLevel: number } {
  const xpPerLevel = 500;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const xpIntoLevel = totalXp % xpPerLevel;
  return { level, xpIntoLevel, xpForNextLevel: xpPerLevel };
}
