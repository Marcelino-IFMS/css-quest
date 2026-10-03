export type SelectorType = "tag" | "classe" | "id";

export type SelectorChallenge = {
  id: string;
  order: number;
  type: SelectorType;
  instruction: string; // pode conter <b> e <code> simples
  selector: string;
  decl: Record<string, string>; // propriedade -> valor esperado
};

// Documento de referência fixo, igual para todas as 10 fases
// (o mesmo conceito do jogo original: um "blog" com elementos variados)
export const referenceHtmlLines = [
  '<div class="card" id="principal">',
  '  <header id="topo">',
  "    <h1>Meu Blog de Tecnologia</h1>",
  '    <h2 class="subtitulo">Front-end</h2>',
  '    <h3 class="subtitulo">CSS Avançado</h3>',
  "  </header>",
  "  <p>Este é o primeiro parágrafo do post.</p>",
  '  <p class="destaque">Este parágrafo tem uma classe especial.</p>',
  "  <p>Mais um parágrafo comum por aqui.</p>",
  '  <span class="autor">Escrito por Ana</span>',
  "  <ul>",
  "    <li>Primeiro item</li>",
  "    <li>Segundo item</li>",
  "    <li>Terceiro item</li>",
  "    <li>Quarto item</li>",
  "  </ul>",
  '  <button id="btn-curtir">Curtir</button>',
  "  <footer>",
  '    <a href="#" class="link-topo">Voltar ao topo</a>',
  "  </footer>",
  "</div>",
];

export const selectorChallenges: SelectorChallenge[] = [
  {
    id: "sel-1",
    order: 1,
    type: "tag",
    instruction: "Selecione TODOS os parágrafos (<code>&lt;p&gt;</code>) e deixe o texto vermelho.",
    selector: "p",
    decl: { color: "red" },
  },
  {
    id: "sel-2",
    order: 2,
    type: "id",
    instruction: "Selecione o elemento com ID <code>topo</code> e centralize o texto.",
    selector: "#topo",
    decl: { "text-align": "center" },
  },
  {
    id: "sel-3",
    order: 3,
    type: "classe",
    instruction: "Selecione quem tem a CLASSE <code>destaque</code> e deixe o fundo amarelo.",
    selector: ".destaque",
    decl: { "background-color": "yellow" },
  },
  {
    id: "sel-4",
    order: 4,
    type: "tag",
    instruction: "Selecione os itens da lista (<code>&lt;li&gt;</code>) e deixe em negrito.",
    selector: "li",
    decl: { "font-weight": "bold" },
  },
  {
    id: "sel-5",
    order: 5,
    type: "id",
    instruction: "Selecione o elemento com ID <code>btn-curtir</code> e deixe o fundo verde.",
    selector: "#btn-curtir",
    decl: { "background-color": "green" },
  },
  {
    id: "sel-6",
    order: 6,
    type: "classe",
    instruction: "Selecione quem tem a CLASSE <code>autor</code> e deixe em itálico.",
    selector: ".autor",
    decl: { "font-style": "italic" },
  },
  {
    id: "sel-7",
    order: 7,
    type: "classe",
    instruction: "Selecione quem tem a CLASSE <code>subtitulo</code>, deixe azul E em negrito (2 propriedades).",
    selector: ".subtitulo",
    decl: { color: "blue", "font-weight": "bold" },
  },
  {
    id: "sel-8",
    order: 8,
    type: "tag",
    instruction: "De novo os parágrafos (<code>&lt;p&gt;</code>): vermelho E com fonte de 20px (2 propriedades).",
    selector: "p",
    decl: { color: "red", "font-size": "20px" },
  },
  {
    id: "sel-9",
    order: 9,
    type: "id",
    instruction: "Selecione o ID <code>principal</code>: fundo cinza claro e texto centralizado (2 propriedades).",
    selector: "#principal",
    decl: { "background-color": "lightgray", "text-align": "center" },
  },
  {
    id: "sel-10",
    order: 10,
    type: "tag",
    instruction: "Fase final: selecione os parágrafos (<code>&lt;p&gt;</code>): vermelho, fonte de 20px e centralizado (3 propriedades).",
    selector: "p",
    decl: { color: "red", "font-size": "20px", "text-align": "center" },
  },
];

export function getSelectorChallengeByOrder(order: number): SelectorChallenge | undefined {
  return selectorChallenges.find((c) => c.order === order);
}
