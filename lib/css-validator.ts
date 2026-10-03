export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: "no-braces" | "no-colon" | "wrong-selector" | "wrong-property" | "wrong-value" | "empty"; message: string };

function normalize(value: string): string {
  return value.trim().replace(/;$/, "").replace(/\s+/g, " ").toLowerCase();
}

/**
 * Valida uma unica regra CSS escrita pelo aluno, no formato:
 *   seletor { propriedade: valor; }
 * Comparando com o que o desafio espera.
 */
export function validateCss(
  studentCode: string,
  expectedSelector: string,
  expectedProperty: string,
  expectedValue: string | string[]
): ValidationResult {
  const code = studentCode.trim();

  if (!code) {
    return { ok: false, reason: "empty", message: "Escreva o seu código CSS antes de conferir." };
  }

  const braceMatch = code.match(/^([^{]+)\{([^}]*)\}\s*$/);
  if (!braceMatch) {
    return {
      ok: false,
      reason: "no-braces",
      message: "Não encontrei o formato seletor { propriedade: valor; }. Confira se você usou { e } corretamente.",
    };
  }

  const selectorPart = braceMatch[1].trim();
  const bodyPart = braceMatch[2].trim();

  if (normalize(selectorPart) !== normalize(expectedSelector)) {
    return {
      ok: false,
      reason: "wrong-selector",
      message: `O seletor certo para esse desafio é ${expectedSelector}. Você escreveu ${selectorPart || "(nada)"}.`,
    };
  }

  // pega so a primeira declaracao (MVP: um desafio = uma propriedade)
  const firstDeclaration = bodyPart.split(";").map((s) => s.trim()).filter(Boolean)[0];

  if (!firstDeclaration) {
    return { ok: false, reason: "empty", message: "O seletor está certo, mas falta escrever a propriedade e o valor dentro das chaves." };
  }

  if (!firstDeclaration.includes(":")) {
    return {
      ok: false,
      reason: "no-colon",
      message: "Faltaram os dois-pontos ( : ) entre a propriedade e o valor.",
    };
  }

  const [rawProperty, ...rest] = firstDeclaration.split(":");
  const property = rawProperty.trim();
  const value = rest.join(":").trim();

  if (normalize(property) !== normalize(expectedProperty)) {
    return {
      ok: false,
      reason: "wrong-property",
      message: `A propriedade certa para esse desafio é ${expectedProperty}. Você escreveu ${property || "(nada)"}.`,
    };
  }

  const acceptedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue];
  const normalizedValue = normalize(value);
  const matches = acceptedValues.some((v) => normalize(v) === normalizedValue);

  if (!matches) {
    return {
      ok: false,
      reason: "wrong-value",
      message: `O valor esperado é ${acceptedValues[0]}. Você escreveu ${value || "(nada)"}.`,
    };
  }

  return { ok: true };
}
