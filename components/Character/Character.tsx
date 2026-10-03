type CharacterProps = {
  studentCss: string;
};

// id unico para nao vazar estilo entre varias instancias do personagem na mesma pagina
const SCOPE_ID = "css-quest-character-preview";

export default function Character({ studentCss }: CharacterProps) {
  return (
    <div id={SCOPE_ID} className="flex items-center justify-center py-10">
      {/*
        O CSS que o aluno escreve e injetado aqui dentro, escopado pelo id acima.
        As classes abaixo (camiseta, camiseta-texto, etc.) sao as mesmas que os
        desafios em lib/challenges.ts pedem para o aluno estilizar.
      */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: scopeCss(studentCss, `#${SCOPE_ID}`) }}
      />

      <div className="boneco flex flex-col items-center">
        <div className="cabeca relative w-16 h-16 rounded-full bg-[#F1C7A3] border-2 border-[#3F2A1D]">
          <div className="cabelo absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 rounded-t-full bg-[#4A2E18]" />
          <div className="olho-esquerdo absolute top-6 left-4 w-1.5 h-1.5 rounded-full bg-black" />
          <div className="olho-direito absolute top-6 right-4 w-1.5 h-1.5 rounded-full bg-black" />
        </div>

        <div className="torso flex items-start">
          <div className="braco-esquerdo w-3 h-16 rounded-full bg-[#F1C7A3] mt-2" />

          <div className="camiseta w-24 h-20 bg-gray-300 flex items-center justify-center overflow-hidden">
            <span className="camiseta-texto text-xs font-normal not-italic">CSS</span>
          </div>

          <div className="braco-direito w-3 h-16 rounded-full bg-[#F1C7A3] mt-2" />
        </div>

        <div className="pernas flex gap-1">
          <div className="perna-esquerda w-5 h-14 bg-[#2B2E27]" />
          <div className="perna-direita w-5 h-14 bg-[#2B2E27]" />
        </div>

        <div className="sapatos flex gap-1.5">
          <div className="sapato-esquerdo w-6 h-3 rounded-sm bg-black" />
          <div className="sapato-direito w-6 h-3 rounded-sm bg-black" />
        </div>
      </div>
    </div>
  );
}

/**
 * Prefixa cada seletor do CSS do aluno com o id de escopo, para que o estilo
 * só afete o personagem dentro desta prévia, e não vaze para o resto da página.
 * Implementação simples (MVP): funciona bem para o caso de uso do jogo
 * (uma regra, um seletor de classe simples por vez).
 */
function scopeCss(rawCss: string, scopePrefix: string): string {
  if (!rawCss.trim()) return "";
  try {
    return rawCss.replace(/([^{}]+)\{([^{}]*)\}/g, (_match, selector: string, body: string) => {
      const scopedSelector = selector
        .split(",")
        .map((s) => `${scopePrefix} ${s.trim()}`)
        .join(", ");
      return `${scopedSelector} { ${body} }`;
    });
  } catch {
    return "";
  }
}
