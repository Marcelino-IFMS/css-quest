# CSS Quest

Jogo educativo para ensinar CSS: o aluno recebe uma missão (ex: "pinte a camiseta de azul"),
escreve a regra CSS, vê o personagem mudar em tempo real, e confere se acertou.

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
  page.tsx                  → tela inicial (nome do jogador + mapa de fases)
  jogo/[lesson]/page.tsx     → tela de uma missão específica
  api/progress/route.ts      → GET/POST do progresso (Redis ou memória)

components/
  Character/     → personagem em HTML+CSS, recebe o CSS do aluno
  CssEditor/      → editor de texto simples
  Challenge/      → junta missão + personagem + editor + validação
  Feedback/       → acerto/erro com explicação
  Progress/       → barra de fases e XP
  Hint/           → dica progressiva (texto → erro comum)

lib/
  challenges.ts      → as 12 fases (edite aqui para adicionar/mudar desafios)
  css-validator.ts   → compara o CSS do aluno com o esperado
  scoring.ts          → cálculo de XP
  redis.ts             → acesso ao Vercel KV, com fallback em memória
  usePlayer.ts          → hook de identidade do jogador (localStorage + API)
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
- Fluxo completo testado num navegador real: nome → mapa de fases → missão →
  preview ao vivo → acerto → próxima fase desbloqueada
- Validador testado com 9 casos (acerto, erro de sintaxe, seletor errado,
  propriedade errada, valores alternativos como hex, etc.) — todos passando
- Sistema de dica progressiva testado (dica → erro comum)
