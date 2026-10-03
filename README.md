# CSS Quest

Jogo educativo para ensinar CSS, em 2 módulos:

- **Módulo 1 · Seletores** — o aluno escreve a regra CSS completa (seletor + propriedade)
  num documento de referência fixo, e vê os elementos certos se destacarem ao vivo.
  10 fases, progressão: tag → id → classe → combinações de 2 e 3 propriedades.
- **Módulo 2 · Propriedades** — o aluno veste um personagem com CSS, uma propriedade
  por fase (`background-color`, `color`, `width`... até `margin`). Só destrava depois
  do Módulo 1 inteiro completo.

Inclui um **painel do professor** (`/admin`) para acompanhar o progresso de cada aluno
em tempo real, nos dois módulos, com um selo "pronto para competição" assim que o
aluno termina o Módulo 1 — pensado para separar a etapa de treino da etapa de disputa.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem nenhuma configuração extra, o progresso é salvo
em memória no servidor (reinicia ao reiniciar o `npm run dev`) — ótimo para testar,
mas não persiste de verdade. Para persistência real, configure o Redis (abaixo).

## Estrutura do projeto

```
app/
  page.tsx                   → tela inicial (nome do jogador + mapa dos 2 módulos)
  admin/page.tsx              → painel do professor (progresso de todos os alunos)
  selecao/[fase]/page.tsx      → tela de uma fase do Módulo 1 (seletores)
  jogo/[lesson]/page.tsx        → tela de uma fase do Módulo 2 (propriedades)
  api/progress/route.ts          → GET/POST do progresso + ranking (Redis ou memória)

components/
  SelectorChallenge/  → Módulo 1: documento de referência + destaque ao vivo + campo único
  Character/           → Módulo 2: personagem em HTML+CSS, recebe o CSS do aluno
  CssEditor/             → editor de texto simples (Módulo 2)
  Challenge/              → junta missão + personagem + editor + validação (Módulo 2)
  Feedback/                → acerto/erro com explicação (Módulo 2)
  Progress/                 → barra de fases e XP (tela inicial)
  Hint/                      → dica progressiva (texto → erro comum) (Módulo 2)

lib/
  selector-challenges.ts  → as 10 fases do Módulo 1 (documento fixo + seletor esperado)
  challenges.ts            → as 12 fases do Módulo 2 (edite aqui para adicionar/mudar)
  rule-parser.ts             → parser da regra CSS de campo único (Módulo 1)
  css-validator.ts             → compara o CSS do aluno com o esperado (Módulo 2)
  scoring.ts                     → cálculo de pontos/XP dos dois módulos
  redis.ts                         → acesso ao Vercel KV, com fallback em memória
  usePlayer.ts                      → hook de identidade do jogador (localStorage + API)
```

## As 12 fases (nessa ordem)

1. `background-color` — pintar a camiseta
2. `color` — cor do texto
3. `width` — largura da camiseta
4. `height` — altura da camiseta
5. `font-size` — tamanho da letra
6. `font-weight` — negrito
7. `font-style` — itálico
8. `text-align` — centralizar o texto
9. `border` — contornar a camiseta
10. `border-radius` — arredondar cantos
11. `padding` — espaço interno
12. `margin` — espaço externo

Para adicionar, remover ou reordenar fases, edite só o arquivo `lib/challenges.ts`.
Cada fase é um objeto com a missão, o seletor e valor esperados, uma dica, e um
exemplo de erro comum — nada disso exige mexer em nenhum componente.

## Painel do professor

Acesse `/admin` para ver todos os alunos que já jogaram, ordenados por pontuação,
com o progresso de cada um nos dois módulos separadamente e o selo **pronto para
competição** assim que completam o Módulo 1. A lista atualiza sozinha a cada 15
segundos (ou clique em "Atualizar agora"). Sem nenhuma senha por enquanto — é só um
link que só você precisa saber.

## Configurando o Redis (Vercel KV) para persistência real

1. No painel do seu projeto na Vercel, vá em **Storage** → **Create Database** → **KV (Redis)**
2. Conecte o banco ao projeto. A Vercel cria automaticamente as variáveis de ambiente
   `KV_REST_API_URL` e `KV_REST_API_TOKEN`
3. Pronto — o app detecta essas variáveis sozinho e passa a usar o Redis de verdade,
   tanto em produção quanto localmente (se você copiar as mesmas variáveis para um
   arquivo `.env.local`)

Sem essas variáveis configuradas, o app continua funcionando normalmente, só que o
progresso fica apenas na memória do servidor (não recomendado para uso real em sala).

## Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório do projeto direto pelo painel da Vercel (vercel.com/new).
Depois do primeiro deploy, configure o Redis como descrito acima.

## Testes feitos antes da entrega

- `npm run build` passa sem erros (TypeScript + ESLint)
- Módulo 1: as 10 fases resolvidas automaticamente num navegador real, uma por uma,
  todas validando corretamente (seletor + propriedades, incluindo fases com 2 e 3
  propriedades na mesma regra)
- Confirmado que o Módulo 2 fica trancado até o Módulo 1 estar 100% completo, e
  destrava sozinho na hora certa
- Painel do professor testado com múltiplos alunos simulados: progresso por módulo,
  nível, pontos e selo de "pronto para competição" aparecendo corretamente
- Validador do Módulo 2 testado com 9 casos (acerto, erro de sintaxe, seletor
  errado, propriedade errada, valores alternativos como hex, etc.)
- Sistema de dica progressiva testado (dica → erro comum)
