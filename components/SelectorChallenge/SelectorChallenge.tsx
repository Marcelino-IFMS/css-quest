"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  selectorChallenges,
  referenceHtmlLines,
  getSelectorChallengeByOrder,
  type SelectorChallenge as SelectorChallengeType,
} from "@/lib/selector-challenges";
import { parseRule, parseDeclarations, declarationsMatch } from "@/lib/rule-parser";
import { calculateSelectorPoints } from "@/lib/scoring";
import { usePlayer } from "@/lib/usePlayer";

const TYPE_INFO: Record<string, { icon: string; label: string }> = {
  tag: { icon: "🏷️", label: "use uma TAG" },
  classe: { icon: "🎨", label: "use uma CLASSE (.)" },
  id: { icon: "🆔", label: "use um ID (#)" },
};

type Props = { order: number };

export default function SelectorChallenge({ order }: Props) {
  const router = useRouter();
  const { markCompleted } = usePlayer();
  const challenge = getSelectorChallengeByOrder(order) as SelectorChallengeType;

  const previewRef = useRef<HTMLDivElement>(null);
  const [ruleText, setRuleText] = useState("");
  const [matchCount, setMatchCount] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [fieldState, setFieldState] = useState<"" | "state-ok" | "state-bad">("");
  const [locked, setLocked] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [pointsEarned, setPointsEarned] = useState<number | undefined>(undefined);

  useEffect(() => {
    setRuleText("");
    setMatchCount("");
    setFeedback(null);
    setFieldState("");
    setLocked(false);
    setWrongAttempts(0);
    setStartedAt(Date.now());
    setPointsEarned(undefined);
    clearHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  function clearHighlights() {
    const root = previewRef.current;
    if (!root) return;
    root.querySelectorAll(".sel-match").forEach((el) => {
      el.classList.remove("sel-match");
      el.removeAttribute("style");
    });
  }

  // aplica estilo ao vivo conforme o aluno digita, igual ao jogo original
  useEffect(() => {
    clearHighlights();
    const root = previewRef.current;
    if (!root) return;
    const parsed = parseRule(ruleText);
    if (!parsed.selector) {
      setMatchCount("");
      return;
    }
    try {
      const matches = root.querySelectorAll(parsed.selector);
      const declMap = parseDeclarations(parsed.declText);
      matches.forEach((el) => {
        el.classList.add("sel-match");
        Object.entries(declMap).forEach(([prop, val]) => {
          try {
            (el as HTMLElement).style.setProperty(prop, val);
          } catch {
            /* propriedade invalida, ignora */
          }
        });
      });
      setMatchCount(`${matches.length} ${matches.length === 1 ? "elemento" : "elementos"}`);
    } catch {
      setMatchCount("seletor inválido");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleText]);

  if (!challenge) return <p className="text-center text-gray-600">Fase não encontrada.</p>;

  function handleSubmit() {
    if (locked) return;
    const raw = ruleText.trim();
    if (!raw) {
      setFeedback({ msg: "Escreva a regra antes de confirmar.", ok: false });
      return;
    }

    const parsed = parseRule(raw);
    if (!parsed.hasBraces || !parsed.selector) {
      setWrongAttempts((n) => n + 1);
      setFeedback({ msg: "Não esqueça das chaves { }! O formato é: seletor { propriedade: valor; }", ok: false });
      setFieldState("state-bad");
      return;
    }

    const root = previewRef.current!;
    let matched: NodeListOf<Element>;
    try {
      matched = root.querySelectorAll(parsed.selector);
    } catch {
      setWrongAttempts((n) => n + 1);
      setFeedback({ msg: "Esse seletor não é válido. Confira os exemplos.", ok: false });
      setFieldState("state-bad");
      return;
    }

    let expected: Element[];
    try {
      expected = Array.from(root.querySelectorAll(challenge.selector));
    } catch {
      expected = [];
    }
    const matchedArr = Array.from(matched);
    const selectorOk =
      matchedArr.length === expected.length && matchedArr.every((el) => expected.includes(el));

    const typedDecl = parseDeclarations(parsed.declText);
    const declCheck = declarationsMatch(challenge.decl, typedDecl);

    if (selectorOk && declCheck.ok) {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      const pts = calculateSelectorPoints(elapsedSeconds, wrongAttempts);
      setPointsEarned(pts);
      setLocked(true);
      setFeedback({ msg: `Isso mesmo! +${pts} pontos`, ok: true });
      setFieldState("state-ok");
      markCompleted(challenge.id, pts);
      return;
    }

    setWrongAttempts((n) => n + 1);
    setFieldState("state-bad");
    if (!selectorOk) {
      setFeedback({
        msg: `O seletor ainda não é esse. Ele pegou ${matchedArr.length} elemento(s), não é o que a fase pede.`,
        ok: false,
      });
    } else if (declCheck.missing.length) {
      setFeedback({ msg: `O seletor está certo! Mas falta a propriedade "${declCheck.missing[0]}".`, ok: false });
    } else {
      const w = declCheck.wrong[0];
      setFeedback({ msg: `O seletor está certo! Mas "${w.prop}" deveria ser "${w.expected}", não "${w.got}".`, ok: false });
    }
  }

  function handleNext() {
    const next = selectorChallenges.find((c) => c.order === challenge.order + 1);
    if (next) {
      router.push(`/selecao/${next.order}`);
    } else {
      router.push("/jogo/1");
    }
  }

  const typeInfo = TYPE_INFO[challenge.type];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <span>
          Módulo 1 · Seletores · Fase {challenge.order}/{selectorChallenges.length}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#F1F6EC] text-[#3F6B1D] mr-2">
          {typeInfo.icon} {typeInfo.label}
        </span>
        <p className="mt-2 text-lg font-semibold text-gray-800" dangerouslySetInnerHTML={{ __html: challenge.instruction }} />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-[#2B2E27] rounded-xl overflow-hidden">
          <div className="text-xs text-gray-400 px-4 py-2 border-b border-[#3a3d35]">html de referência</div>
          <pre className="text-[#E8E8E3] text-xs p-4 overflow-x-auto font-mono leading-relaxed">
            {referenceHtmlLines.join("\n")}
          </pre>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="text-xs text-gray-400 px-4 py-2 border-b border-gray-100">pré-visualização (ao vivo)</div>
          <div ref={previewRef} className="p-4 text-sm selector-preview">
            <div className="card" id="principal">
              <header id="topo">
                <h1 className="text-base font-bold">Meu Blog de Tecnologia</h1>
                <h2 className="subtitulo text-sm text-gray-500">Front-end</h2>
                <h3 className="subtitulo text-xs text-gray-500">CSS Avançado</h3>
              </header>
              <p>Este é o primeiro parágrafo do post.</p>
              <p className="destaque">Este parágrafo tem uma classe especial.</p>
              <p>Mais um parágrafo comum por aqui.</p>
              <span className="autor block text-xs text-gray-500 mb-2">Escrito por Ana</span>
              <ul className="list-disc pl-5">
                <li>Primeiro item</li>
                <li>Segundo item</li>
                <li>Terceiro item</li>
                <li>Quarto item</li>
              </ul>
              <button id="btn-curtir" className="border rounded px-3 py-1 text-xs my-2">
                Curtir
              </button>
              <footer className="border-t pt-2 mt-2">
                <a href="#" className="link-topo text-xs text-[#E8B339]">
                  Voltar ao topo
                </a>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="text-xs font-mono text-gray-400 block mb-2">escreva a regra CSS completa</label>
        <div
          className={`flex items-center border rounded-lg px-3 ${
            fieldState === "state-ok" ? "border-[#5F922F]" : fieldState === "state-bad" ? "border-[#a3291f]" : "border-gray-300"
          }`}
        >
          <span className="font-mono text-xs text-[#5F922F] font-bold mr-2">CSS</span>
          <input
            type="text"
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSubmit())}
            placeholder="ex: p { color: red; }"
            spellCheck={false}
            className="flex-1 font-mono text-red-900 text-sm py-3 outline-none"
          />
          <span className="text-xs font-mono text-gray-400 whitespace-nowrap">{matchCount}</span>
        </div>

        {feedback && (
          <p className={`mt-3 font-semibold text-sm ${feedback.ok ? "text-[#3F6B1D]" : "text-[#a3291f]"}`}>
            {feedback.msg}
            {pointsEarned !== undefined && ` (+${pointsEarned} pontos)`}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          {!locked && (
            <button onClick={handleSubmit} className="px-5 py-2 rounded-full bg-[#1f4d2c] text-white font-semibold hover:bg-[#2c6b3d] transition">
              Confirmar
            </button>
          )}
          {locked && (
            <button onClick={handleNext} className="px-5 py-2 rounded-full bg-[#E8B339] text-[#14291c] font-semibold hover:brightness-95 transition">
              Próxima fase →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
