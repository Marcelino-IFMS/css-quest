"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Character from "@/components/Character/Character";
import CssEditor from "@/components/CssEditor/CssEditor";
import Feedback from "@/components/Feedback/Feedback";
import Hint from "@/components/Hint/Hint";
import { validateCss, type ValidationResult } from "@/lib/css-validator";
import { calculateXp } from "@/lib/scoring";
import { getChallengeByOrder, getNextChallenge, type Challenge as ChallengeType } from "@/lib/challenges";
import { usePlayer } from "@/lib/usePlayer";

type ChallengeProps = {
  order: number;
};

export default function Challenge({ order }: ChallengeProps) {
  const router = useRouter();
  const { markCompleted } = usePlayer();

  const challenge = getChallengeByOrder(order) as ChallengeType;
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [xpEarned, setXpEarned] = useState<number | undefined>(undefined);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    setCode("");
    setResult(null);
    setHintsUsed(0);
    setAttempts(0);
    setXpEarned(undefined);
    setStartedAt(Date.now());
  }, [order]);

  if (!challenge) {
    return <p className="text-center text-gray-600">Fase não encontrada.</p>;
  }

  function handleCheck() {
    const attemptNumber = attempts + 1;
    setAttempts(attemptNumber);

    const validation = validateCss(code, challenge.selector, challenge.property, challenge.expectedValue);
    setResult(validation);

    if (validation.ok) {
      const secondsTaken = Math.round((Date.now() - startedAt) / 1000);
      const xp = calculateXp(challenge.xpBase, secondsTaken, hintsUsed, attemptNumber);
      setXpEarned(xp);
      markCompleted(challenge.id, xp);
    }
  }

  function handleNext() {
    const next = getNextChallenge(challenge.order);
    if (next) {
      router.push(`/jogo/${next.order}`);
    } else {
      router.push("/?completo=true");
    }
  }

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
      <div>
        <p className="text-xs uppercase tracking-wide text-[#E8B339] font-bold mb-1">
          Fase {challenge.order} · {challenge.property}
        </p>
        <h1 className="text-2xl font-bold text-[#3F6B1D] mb-3">{challenge.title}</h1>
        <p className="text-gray-700 mb-4">{challenge.mission}</p>
        {challenge.analogy && (
          <p className="text-sm text-gray-500 italic mb-4">{challenge.analogy}</p>
        )}

        <CssEditor value={code} onChange={setCode} placeholder={`${challenge.selector} {\n  \n}`} />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleCheck}
            className="px-5 py-2 rounded-full bg-[#1f4d2c] text-white font-semibold hover:bg-[#2c6b3d] transition"
          >
            Conferir
          </button>
          {result?.ok && (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-full bg-[#E8B339] text-[#14291c] font-semibold hover:brightness-95 transition"
            >
              Próxima fase →
            </button>
          )}
        </div>

        <Feedback result={result} explanation={challenge.explanation} xpEarned={xpEarned} />

        {!result?.ok && (
          <Hint
            hintText={challenge.hint}
            commonErrorCode={challenge.commonError.code}
            commonErrorExplanation={challenge.commonError.explanation}
            onHintUsed={() => setHintsUsed((h) => h + 1)}
          />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 sticky top-6">
        <Character studentCss={code} />
      </div>
    </div>
  );
}
