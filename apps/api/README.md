# 🛠️ Backend – WeFinance (apps/api)

API RESTful construída em **NestJS 11 + Prisma + PostgreSQL** para prover serviços de autenticação, gestão de receitas, despesas, investimentos e dashboards analíticos.

## 📂 Estrutura Geral
```
apps/api/
├── src/
│   ├── main.ts              # Bootstrap Nest
│   ├── app.module.ts        # Root module
│   ├── lib/                 # Libs auxiliares (ex: auth wrapper)
│   ├── utils/
│   │   ├── prisma.service.ts  # Conexão e extensão Prisma
│   │   └── seed.ts           # Script de seed
│   ├── modules/
│   │   ├── category/
│   │   ├── dashboard/
│   │   ├── expense/
│   │   ├── income/
│   │   ├── investment/
│   │   ├── payment-method/
│   │   └── user/
│   │       └── ... (controllers, services, dtos, repositories)
└── prisma/
    ├── schema.prisma
    └── migrations/
```

## 🧩 Stack Técnica
| Área | Tecnologia | Uso |
|------|------------|-----|
| Framework | NestJS 11 | Módulos, injeção de dependências |
| ORM | Prisma 6 | Acesso e modelagem relacional |
| Banco | PostgreSQL | Armazenamento persistente |
| Auth | better-auth | Sessões stateless seguras |
| Validação | Zod | Schemas de entrada |
| Build | TypeScript 5 | Tipagem e transpile |

## 🔐 Autenticação & Sessões
- Implementada com `better-auth` encapsulada em `lib/auth.ts`
- Tokens stateless (sem session store centralizada)
- Associações por usuário para receitas, despesas, investimentos
- Verificação de IP/user-agent para fortalecer segurança (planejado)

## 🗄️ Modelagem de Dados (Resumo)
Principais entidades (ver `prisma/schema.prisma`):
- User
- Session / (estrutura de auth do provider)
- Category (tipada por contexto: receita, despesa, investimento)
- Expense (+ parcelas geradas automaticamente se parcelada)
- Income (recorrência mensal opcional)
- Investment
- PaymentMethod

Regras principais:
- Valores monetários em decimal (2 casas)
- Datas normalizadas em UTC
- Campos enumerados para status (ex: PENDENTE, PAGO / RECEBIDO)

## 💾 Migrations & Versionamento
- Diretório `prisma/migrations` versiona alterações
- Uso diário: `pnpm prisma migrate dev --name <nome>`
- Deploy: `pnpm prisma migrate deploy`
- Geração de client: `pnpm prisma generate`

## 🧪 Seed
Script em `utils/seed.ts` cria:
- Usuário inicial
- Categorias base
- Exemplos de receitas/despesas/investimentos
Execução: `pnpm run db:seed`

## 🏛️ Organização de Módulos
Cada módulo segue:
```
/modules/<domínio>/
  ├── controllers/   # Endpoints HTTP
  ├── services/      # Regras de negócio
  ├── repository.ts  # Acesso direto ao Prisma (query patterns)
  ├── dtos/          # Schemas/validação
  └── module.ts      # Declaração Nest
```

## 📡 Convenções de API
| Aspecto | Padrão |
|---------|--------|
| URL base | `/api` (ou raiz conforme gateway) |
| Versionamento | (planejado) `/v1` futuro |
| Formato | JSON UTF-8 |
| Datas | ISO 8601 (UTC) |
| Paginação | query params: `page`, `limit` |
| Filtros | query params nomeados (`status`, `categoryId`, `from`, `to`) |
| Ordenação | `sort=<field>:asc|desc` (planejado) |
| Autorização | Header `Authorization: Bearer <token>` |

## 🧪 Validação
- Zod para validar DTOs (entrada) antes da camada de serviço
- Sanitização mínima aplicada (ex: trim em strings críticas)
- Erros padronizados retornam status e message coerentes

## ⚙️ Configuração & Env
Arquivo `.env` (exemplo Docker):
```
DATABASE_URL=postgresql://docker:docker@localhost:5432/docker
CLIENT_ORIGIN=http://localhost:3000
```
Adicionar conforme necessário:
```
PORT=3333
NODE_ENV=development
```

## 🔄 Ciclo de Requisição (Exemplo Receita)
1. Controller recebe POST `/incomes`
2. DTO validado (Zod)
3. Service aplica regra (ex: recorrência -> gera instâncias)
4. Repository persiste via Prisma
5. Retorno normalizado para o client

## 🧠 Regras de Negócio (Resumo Técnico)
| Domínio | Regras |
|---------|--------|
| Income | Recorrência mensal gera clonagem futura (planejado) |
| Expense | Parcelada gera N registros filhos datados |
| Investment | Registro de valor inicial + retorno esperado |
| Category | Escopo por tipo (não cruzar contextos) |
| PaymentMethod | Associável a expense/income conforme fluxo |

## 📈 Performance & Boas Práticas
- Índices definidos em campos de busca frequente (planejado / validar schema)
- Selects explícitos em queries críticas para reduzir payload
- Evitar N+1: agrupar queries via `in` / `batch`
- Paginação server-side consistente

## 🛡️ Segurança
- Sanitização de entrada via validação
- CORS restrito ao `CLIENT_ORIGIN`
- Tokens com expiração curta (ajustar conforme auth provider)
- Planejado: rate limit / audit logging

## 🧪 Testes
Scripts disponíveis:
```
pnpm run test       # unit
pnpm run test:e2e   # end-to-end
pnpm run test:cov   # cobertura
```
Padrões:
- Mocks para Prisma nas unidades
- E2E usando banco isolado (ou schema shadow)

## 🚀 Scripts Principais
```bash
pnpm run dev          # Desenvolvimento (hot reload)
pnpm run build        # Build produção
pnpm run start:prod   # Executa build
pnpm run lint         # Lint (Biome)
pnpm run format       # Format
pnpm prisma studio    # UI do banco
pnpm run db:seed      # Seed inicial
```

## 🤝 Contribuição Backend
- Manter separação clara Controller vs Service vs Repository
- Não misturar validação de input dentro de services
- Reaproveitar schemas Zod
- Evitar leakage de modelos Prisma (mapear para DTO de saída)

## 📜 Licença
MIT (ver README raiz).
