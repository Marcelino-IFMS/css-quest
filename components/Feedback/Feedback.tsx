import type { ValidationResult } from "@/lib/css-validator";

type FeedbackProps = {
  result: ValidationResult | null;
  explanation: string;
  xpEarned?: number;
};

export default function Feedback({ result, explanation, xpEarned }: FeedbackProps) {
  if (!result) return null;

  if (result.ok) {
    return (
      <div className="rounded-lg border-2 border-[#5F922F] bg-[#F1F6EC] p-4 mt-4">
        <p className="font-bold text-[#3F6B1D]">Acertou!</p>
        <p className="text-sm text-gray-700 mt-1">{explanation}</p>
        {typeof xpEarned === "number" && (
          <p className="text-sm font-semibold text-[#E8B339] mt-2">+{xpEarned} XP</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-[#a3291f] bg-[#fdeceb] p-4 mt-4">
      <p className="font-bold text-[#a3291f]">Quase lá</p>
      <p className="text-sm text-gray-700 mt-1">{result.message}</p>
    </div>
  );
}
