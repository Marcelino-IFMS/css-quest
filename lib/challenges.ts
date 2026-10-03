export type Challenge = {
  id: string;
  order: number;
  property: string;
  title: string;
  mission: string;
  analogy?: string;
  selector: string;
  expectedValue: string | string[]; // aceita mais de um valor correto (ex: "blue" ou "#0000ff")
  explanation: string;
  hint: string;
  commonError: {
    code: string;
    explanation: string;
  };
  xpBase: number;
};

export const challenges: Challenge[] = [
  {
    id: "shirt-bg-color",
    order: 1,
    property: "background-color",
    title: "Pinte a camiseta",
    mission: "Pinte a camiseta do personagem de azul.",
    selector: ".camiseta",
    expectedValue: ["blue", "#0000ff", "#00f"],
    explanation:
      "background-color muda a cor de fundo de um elemento. Como a camiseta não tem imagem nem texto cobrindo tudo, o fundo é o que a gente vê.",
    hint: 'A propriedade que muda a cor de fundo é background-color. Experimente: .camiseta { background-color: blue; }',
    commonError: {
      code: ".camiseta {\n  background-color blue;\n}",
      explanation: "Faltou os dois-pontos ( : ) entre a propriedade e o valor.",
    },
    xpBase: 100,
  },
  {
    id: "shirt-text-color",
    order: 2,
    property: "color",
    title: "Mude a cor do texto",
    mission: "Deixe o texto da camiseta branco, para ficar visível.",
    selector: ".camiseta-texto",
    expectedValue: ["white", "#ffffff", "#fff"],
    explanation:
      "color muda a cor do texto de um elemento. É fácil confundir com background-color, mas um pinta o texto, o outro pinta o fundo.",
    hint: 'Para cor de texto, a propriedade é só color (sem "background"). Experimente: .camiseta-texto { color: white; }',
    commonError: {
      code: ".camiseta-texto {\n  background-color: white;\n}",
      explanation: "Isso pinta o FUNDO de branco, não o texto. Para o texto, use color, não background-color.",
    },
    xpBase: 100,
  },
  {
    id: "shirt-width",
    order: 3,
    property: "width",
    title: "Alargue a camiseta",
    mission: "Deixe a camiseta com 140px de largura.",
    selector: ".camiseta",
    expectedValue: ["140px"],
    explanation: "width controla a largura de um elemento. O valor em px define um tamanho fixo, em pixels.",
    hint: "Experimente: .camiseta { width: 140px; }",
    commonError: {
      code: ".camiseta {\n  width: 140;\n}",
      explanation: "Faltou a unidade. Em CSS, um número de tamanho quase sempre precisa de unidade, como px.",
    },
    xpBase: 120,
  },
  {
    id: "shirt-height",
    order: 4,
    property: "height",
    title: "Aumente a altura",
    mission: "Deixe a camiseta com 100px de altura.",
    selector: ".camiseta",
    expectedValue: ["100px"],
    explanation: "height controla a altura de um elemento, do mesmo jeito que width controla a largura.",
    hint: "Experimente: .camiseta { height: 100px; }",
    commonError: {
      code: ".camiseta {\n  heigth: 100px;\n}",
      explanation: 'A propriedade está escrita errado: é height, não "heigth".',
    },
    xpBase: 120,
  },
  {
    id: "shirt-font-size",
    order: 5,
    property: "font-size",
    title: "Aumente a letra",
    mission: "Aumente o tamanho da frase da camiseta para 24px.",
    selector: ".camiseta-texto",
    expectedValue: ["24px"],
    explanation: "font-size controla o tamanho do texto.",
    hint: "Experimente: .camiseta-texto { font-size: 24px; }",
    commonError: {
      code: ".camiseta-texto {\n  size: 24px;\n}",
      explanation: 'Não existe a propriedade "size" sozinha em CSS de texto. O nome certo é font-size.',
    },
    xpBase: 100,
  },
  {
    id: "shirt-font-weight",
    order: 6,
    property: "font-weight",
    title: "Deixe em negrito",
    mission: "Deixe o texto da camiseta em negrito.",
    selector: ".camiseta-texto",
    expectedValue: ["bold", "700"],
    explanation: "font-weight controla a espessura da fonte. bold é o valor mais comum para negrito.",
    hint: "Experimente: .camiseta-texto { font-weight: bold; }",
    commonError: {
      code: ".camiseta-texto {\n  font-weight: strong;\n}",
      explanation: '"strong" não é um valor válido de font-weight. Use bold (ou um número como 700).',
    },
    xpBase: 110,
  },
  {
    id: "shirt-font-style",
    order: 7,
    property: "font-style",
    title: "Deixe em itálico",
    mission: "Deixe o texto da camiseta em itálico.",
    selector: ".camiseta-texto",
    expectedValue: ["italic"],
    explanation: "font-style controla se o texto é normal ou itálico.",
    hint: "Experimente: .camiseta-texto { font-style: italic; }",
    commonError: {
      code: ".camiseta-texto {\n  font-style: italics;\n}",
      explanation: 'O valor certo é italic, sem o "s" no final.',
    },
    xpBase: 100,
  },
  {
    id: "shirt-text-align",
    order: 8,
    property: "text-align",
    title: "Centralize o texto",
    mission: "Centralize o texto dentro da camiseta.",
    selector: ".camiseta-texto",
    expectedValue: ["center"],
    explanation: "text-align controla o alinhamento horizontal do texto dentro do elemento.",
    hint: "Experimente: .camiseta-texto { text-align: center; }",
    commonError: {
      code: ".camiseta-texto {\n  align: center;\n}",
      explanation: 'Não existe a propriedade "align" sozinha. O nome certo é text-align.',
    },
    xpBase: 110,
  },
  {
    id: "shirt-border",
    order: 9,
    property: "border",
    title: "Contorne a camiseta",
    mission: "Adicione uma borda preta de 2px, sólida, na camiseta.",
    selector: ".camiseta",
    expectedValue: ["2px solid black", "2px solid #000", "2px solid #000000"],
    explanation: "border é um atalho que define, numa linha só, a espessura, o estilo e a cor da borda.",
    hint: "A ordem é espessura, estilo, cor. Experimente: .camiseta { border: 2px solid black; }",
    commonError: {
      code: ".camiseta {\n  border: solid 2px black;\n}",
      explanation: "A ordem dos valores não importa para o border funcionar, mas o padrão mais comum é espessura, estilo, cor — fique atento à ordem para não confundir.",
    },
    xpBase: 130,
  },
  {
    id: "shirt-border-radius",
    order: 10,
    property: "border-radius",
    title: "Arredonde os cantos",
    mission: "Arredonde os cantos da camiseta com 16px de raio.",
    selector: ".camiseta",
    expectedValue: ["16px"],
    explanation: "border-radius arredonda os cantos de um elemento, sem precisar de nenhuma imagem.",
    hint: "Experimente: .camiseta { border-radius: 16px; }",
    commonError: {
      code: ".camiseta {\n  radius: 16px;\n}",
      explanation: 'Não existe a propriedade "radius" sozinha. O nome certo é border-radius.',
    },
    xpBase: 120,
  },
  {
    id: "shirt-padding",
    order: 11,
    property: "padding",
    title: "Dê respiro ao texto",
    mission: "Adicione 12px de padding na camiseta, para o texto não ficar colado na borda.",
    analogy: "padding é o espaço DENTRO da caixa, entre o conteúdo e a borda.",
    selector: ".camiseta",
    expectedValue: ["12px"],
    explanation: "padding empurra o conteúdo para dentro, afastando-o das bordas do elemento.",
    hint: "Experimente: .camiseta { padding: 12px; }",
    commonError: {
      code: ".camiseta {\n  padding: 12;\n}",
      explanation: "Faltou a unidade px no valor.",
    },
    xpBase: 130,
  },
  {
    id: "shirt-margin",
    order: 12,
    property: "margin",
    title: "Afaste do resto",
    mission: "Adicione 20px de margin na camiseta, para afastar ela dos outros elementos do personagem.",
    analogy: "margin é o espaço FORA da caixa, entre ela e os elementos vizinhos.",
    selector: ".camiseta",
    expectedValue: ["20px"],
    explanation: "margin empurra os elementos vizinhos para longe, criando espaço do lado de fora.",
    hint: "Experimente: .camiseta { margin: 20px; }",
    commonError: {
      code: ".camiseta {\n  margin: 20;\n}",
      explanation: "Faltou a unidade px no valor.",
    },
    xpBase: 130,
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}

export function getChallengeByOrder(order: number): Challenge | undefined {
  return challenges.find((c) => c.order === order);
}

export function getNextChallenge(currentOrder: number): Challenge | undefined {
  return challenges.find((c) => c.order === currentOrder + 1);
}
