export type ParsedRule = {
  selector: string;
  declText: string;
  hasBraces: boolean;
};

// Aceita "p{color:red;}" ou "p { color: red; font-size: 20px; }"
export function parseRule(raw: string): ParsedRule {
  const text = raw.trim();
  const braceIdx = text.indexOf("{");
  if (braceIdx === -1) {
    return { selector: text, declText: "", hasBraces: false };
  }
  const selector = text.slice(0, braceIdx).trim();
  const rest = text.slice(braceIdx + 1);
  const closeIdx = rest.lastIndexOf("}");
  const declText = closeIdx === -1 ? rest : rest.slice(0, closeIdx);
  return { selector, declText, hasBraces: true };
}

export function parseDeclarations(text: string): Record<string, string> {
  const map: Record<string, string> = {};
  if (!text) return map;
  text.split(";").forEach((part) => {
    const idx = part.indexOf(":");
    if (idx === -1) return;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part
      .slice(idx + 1)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/^["']|["']$/g, "");
    if (prop) map[prop] = val;
  });
  return map;
}

export function declarationsMatch(
  expected: Record<string, string>,
  typed: Record<string, string>
): { ok: boolean; missing: string[]; wrong: { prop: string; expected: string; got: string }[] } {
  const missing: string[] = [];
  const wrong: { prop: string; expected: string; got: string }[] = [];
  Object.keys(expected).forEach((prop) => {
    const expVal = expected[prop];
    const gotVal = typed[prop];
    if (gotVal === undefined) {
      missing.push(prop);
    } else if (gotVal.replace(/\s+/g, "") !== expVal.replace(/\s+/g, "")) {
      wrong.push({ prop, expected: expVal, got: gotVal });
    }
  });
  return { ok: missing.length === 0 && wrong.length === 0, missing, wrong };
}
