import { challenges } from "@/lib/challenges";
import { levelFromXp } from "@/lib/scoring";

type ProgressProps = {
  completedCount: number;
  totalXp: number;
};

export default function Progress({ completedCount, totalXp }: ProgressProps) {
  const total = challenges.length;
  const pct = Math.round((completedCount / total) * 100);
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(totalXp);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span>
          Fase {completedCount} de {total}
        </span>
        <span>
          Nível {level} · {xpIntoLevel}/{xpForNextLevel} XP
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5F922F] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
