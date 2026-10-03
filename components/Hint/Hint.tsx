import { useState } from "react";

type HintProps = {
  hintText: string;
  commonErrorCode: string;
  commonErrorExplanation: string;
  onHintUsed: () => void;
};

export default function Hint({ hintText, commonErrorCode, commonErrorExplanation, onHintUsed }: HintProps) {
  const [level, setLevel] = useState<0 | 1 | 2>(0);

  function nextLevel() {
    const next = Math.min(level + 1, 2) as 0 | 1 | 2;
    if (next !== level) onHintUsed();
    setLevel(next);
  }

  return (
    <div className="mt-4 text-sm">
      {level === 0 && (
        <button
          onClick={nextLevel}
          className="text-[#3F6B1D] underline underline-offset-2 hover:text-[#5F922F]"
        >
          Travou? Pedir uma dica
        </button>
      )}

      {level >= 1 && (
        <div className="rounded-lg bg-[#FCF3DC] border border-[#E8B339] p-3 mt-2">
          <p className="text-gray-700">{hintText}</p>
          {level === 1 && (
            <button
              onClick={nextLevel}
              className="text-[#3F6B1D] underline underline-offset-2 hover:text-[#5F922F] mt-2 inline-block"
            >
              Ainda travado? Ver um erro comum
            </button>
          )}
        </div>
      )}

      {level === 2 && (
        <div className="rounded-lg bg-[#fdeceb] border border-[#a3291f] p-3 mt-2">
          <p className="text-gray-700 mb-1">Um erro comum nesse desafio:</p>
          <pre className="bg-[#2B2E27] text-[#E8E8E3] rounded p-2 text-xs overflow-x-auto">{commonErrorCode}</pre>
          <p className="text-gray-700 mt-1">{commonErrorExplanation}</p>
        </div>
      )}
    </div>
  );
}
