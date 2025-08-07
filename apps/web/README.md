# 🖥️ Frontend – WeFinance (apps/web)

Aplicação web construída em **Next.js 15 + React 19** focada em experiência fluida, acessível e performática para gestão financeira.

## 📂 Estrutura Geral
```
apps/web/
├── src/
│   ├── app/                # Estrutura App Router (layout, providers, routes)
│   ├── components/         # Componentes reutilizáveis + domínio
│   │   ├── data-table/     # Infraestrutura da tabela (TanStack)
│   │   └── ui/             # Base shadcn (design system)
│   ├── constants/          # Constantes (ex: auth, enums front)
│   ├── hooks/              # Hooks reutilizáveis
│   ├── lib/                # Config/client libs (ky, query, auth helpers)
│   ├── routes/             # Definições de rotas centralizadas
│   ├── services/           # Acesso à API (por entidade)
│   ├── styles/             # Estilos globais (Tailwind layer)
│   └── utils/              # Funções auxiliares (masks, builders)
└── ...configs
```

## 🧩 Principais Tecnologias
| Área | Tecnologia | Uso |
|------|------------|-----|
| Framework | Next.js 15 | App Router, SSR/Streaming |
| UI | React 19 | Componentização |
| Estilo | Tailwind CSS 4 | Atomic styling |
| Design System | shadcn/ui | Componentes acessíveis |
| Formulários | React Hook Form | Controle e validação |
| Schemas | Zod | Validação client-side |
| Estado Server | TanStack Query | Cache de requisições HTTP |
| Tabelas | TanStack Table | Listagens dinâmicas |
| Gráficos | Recharts | Visualizações analíticas |
| HTTP | ky | Cliente leve com interceptors |

## 🧱 Padrões Arquiteturais
- App Router com segmentação por contexto: `(auth)`, `(application)`
- Componentes separados por função: `ui` (base), `data-table` (infra), específicos de domínio
- Services encapsulam chamadas HTTP (ky) e retornam dados tipados
- Hooks expressam comportamento (ex: `usePagination`, `useMobile`)
- Sem estado global complexo: rely em TanStack Query + estado local
- Tipos derivados de schemas Zod sempre que possível

## 🔐 Autenticação no Frontend
- Middleware (`src/middleware.ts`) protege rotas privadas
- Token/session gerenciado via cookies HTTP (servidor + client aware)
- Helpers em `lib/auth.ts`
- Redirecionamento automático se não autenticado

## 🌐 Comunicação com API
- Cliente HTTP: `lib/ky.ts` com baseURL de `NEXT_PUBLIC_API_URL`
- Interceptors para headers e tratamento de erros
- Services organizados por entidade: `services/<entidade>/index.ts`
- Revalidação automática via TanStack Query em mutações

## 📊 Tabelas e Filtros
- Infra em `components/data-table/`
- Filtro composável (`data-table-filter.tsx`)
- Paginação controlada (`usePagination` + server-driven params)
- Sort e filter sincronizados com query params (`utils/query-params-builder.ts`)

## 🎨 UI/UX Padrões
- Componentes base shadcn adaptados
- Dark/Light mode via `ThemeProvider`
- Ícones Lucide centralizados
- Responsividade mobile-first
- Feedback: toasts (futuro), estados de loading skeleton

## 🧪 Qualidade
- Lint/format: Biome
- Tipagem estrita TypeScript (`noUncheckedIndexedAccess` recomendado futuramente)
- Componentes puros e previsíveis
- PRs devem manter acessibilidade (aria-labels, roles)

## 🗂️ Convenções de Nome
| Tipo | Convenção |
|------|-----------|
| Componentes | PascalCase (`ExpenseForm.tsx`) |
| Hooks | `useX` (`usePagination.ts`) |
| Services | `plural` (`expenses/index.ts`) |
| Utils | `kebab-case` (`query-params-builder.ts`) |
| Pastas domínio | `kebab-case` |

## 🔄 Fluxo de Dados (Exemplo)
1. Usuário abre página de despesas
2. Hook de listagem dispara query -> service `services/expense/list`
3. Ky requisita API com query params construídos
4. Resposta cacheada em TanStack Query
5. Tabela renderiza com colDefs e filtros
6. Ações (editar/excluir) disparam mutations -> invalidação de cache

## 🪝 Hooks Internos
| Hook | Função |
|------|--------|
| `useMobile` | Detecta breakpoint para UI adaptativa |
| `usePagination` | Gerencia estado de paginação + sync URL |

## 🧪 Testes (Planejado)
- Componentes críticos (forms, tables) com React Testing Library
- Hooks isolados com mocks
- Snapshot mínimo (somente layout crítico)

## 🚀 Scripts
```bash
pnpm run dev       # Desenvolvimento
pnpm run build     # Build produção
pnpm run start     # Servir build
pnpm run type-check
pnpm run lint
pnpm run format
```

## 🔧 Variáveis de Ambiente
Arquivo `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## 🤝 Contribuindo no Frontend
- Evite lógica pesada em componentes: extraia para hooks ou utils
- Reuse componentes base antes de criar novos
- Sincronize estado de filtros com URL para compartilhamento
- Mantenha serviços sem lógica de apresentação

## 📜 Licença
MIT (ver README raiz).
