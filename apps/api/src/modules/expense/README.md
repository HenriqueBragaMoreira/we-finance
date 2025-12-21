# 💰 Módulo Expense

Este módulo implementa o gerenciamento de despesas da aplicação We Finance, permitindo controle completo de gastos com suporte a parcelamentos, filtros avançados e estatísticas mensais.

## 🚀 Funcionalidades

### 1. **Listar Despesas** (`GET /expenses`)
Retorna todas as despesas com filtros avançados e paginação:
- Filtro por descrição (busca insensível a maiúsculas/minúsculas)
- Filtro por categoria (suporte a múltiplas categorias)
- Filtro por valor específico
- Filtro por método de pagamento
- Filtro por status (PENDING, PAID) - suporte a múltiplos
- Filtro por tipo de despesa (FIXED, VARIABLE) - suporte a múltiplos
- Filtro por data específica (formato YYYY-MM-DD)
- Filtro por usuário
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)
- Inclui informações de parcelamentos

### 2. **Estatísticas Mensais** (`GET /expenses/monthly-stats`)
Retorna estatísticas agregadas de despesas para todos os usuários:
- Total de despesas do mês
- Total de despesas pagas
- Total de despesas pendentes
- Suporte a filtro por mês específico (formato YYYY-MM)
- Padrão para mês atual se não especificado

### 3. **Criar Despesa** (`POST /expenses`)
Cria uma nova despesa com funcionalidades avançadas:
- Criação automática de categoria se não existir
- Criação automática de método de pagamento se não existir
- **Suporte a parcelamentos**: divide automaticamente o valor em parcelas mensais
- Cálculo inteligente de parcelas com ajuste na última para evitar centavos perdidos
- Tipos: FIXED (fixo) ou VARIABLE (variável)
- Status: PENDING ou PAID

### 4. **Atualizar Despesa** (`PATCH /expenses/:id`)
Atualiza uma despesa existente:
- Atualização parcial dos campos
- Suporte a recriação de parcelamentos
- Atualização automática de categoria/método de pagamento
- Recalculo de parcelas se valor ou quantidade for alterada

### 5. **Remover Despesa** (`DELETE /expenses/:id`)
Remove uma despesa e suas parcelas:
- Exclusão em cascata dos parcelamentos
- Exclusão física do registro

### 6. **Atualizar Parcela** (`PATCH /expenses/installments/:id`)
Atualiza uma parcela específica de forma independente:
- Permite alterar apenas **data de vencimento** (`dueDate`)
- Permite alterar apenas **status** (`status`: PENDING ou PAID)
- Atualização parcial e independente da despesa principal
- Útil para gerenciar pagamentos de parcelas individuais

## 🔍 Filtros Disponíveis

### **Filtros de Listagem** (`GET /expenses`)
- **`description`** (opcional): Busca por nome/descrição da despesa
- **`category`** (opcional): Filtra por categoria (suporte a múltiplas separadas por vírgula)
- **`amount`** (opcional): Filtra por valor específico
- **`paymentMethod`** (opcional): Filtra por método de pagamento
- **`status`** (opcional): Filtra por status - aceita múltiplos: `PAID,PENDING`
- **`expenseType`** (opcional): Filtra por tipo - aceita múltiplos: `FIXED,VARIABLE`
- **`date`** (opcional): Filtra por data específica (formato YYYY-MM-DD)
- **`userId`** (opcional): Filtra por usuário específico
- **`init`** (opcional): Número da página (padrão: 0)
- **`limit`** (opcional): Registros por página

### **Filtros de Estatísticas** (`GET /expenses/monthly-stats`)
- **`month`** (opcional): Mês no formato YYYY-MM (padrão: mês atual)

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
expense/
├── expense.module.ts               # Módulo NestJS
├── expense.repository.ts           # Camada de dados (Prisma)
├── controllers/
│   └── expense.controller.ts       # Controller REST API
├── services/
│   └── expense.service.ts          # Lógica de negócio
└── dtos/
    ├── create-expense.dto.ts       # DTO para criação
    ├── update-expense.dto.ts       # DTO para atualização
    ├── update-installment.dto.ts   # DTO para atualizar parcela
    ├── filter-expense.dto.ts       # DTO para filtros
    └── monthly-stats.dto.ts        # DTO para estatísticas
```

## 💡 Características Técnicas

### **Sistema de Parcelamentos Inteligente**
- Divisão automática do valor total em parcelas iguais
- Ajuste da última parcela para evitar centavos perdidos
- Parcelas mensais com vencimento sequencial
- Cada parcela mantém status independente
- Recalculo automático ao atualizar despesa parcelada

### **Gestão Automática de Relacionamentos**
- Criação automática de categorias inexistentes
- Criação automática de métodos de pagamento
- Validação de tipos de categoria (EXPENSE)

### **Filtros Flexíveis**
- Suporte a múltiplos valores separados por vírgula
- Busca case-insensitive
- Filtros de data com range preciso (dia completo)
- Combinação de múltiplos filtros

### **Performance Otimizada**
- Queries otimizadas com includes seletivos
- Paginação eficiente
- Contagem total separada
- Ordenação por índices

### **Segurança e Autenticação**
- AuthGuard aplicado em todas as rotas
- Integração com Better Auth
- Validação de entrada com DTOs
- Queries parametrizadas

## 🔄 Exemplos de Uso

### Listar Todas as Despesas
```bash
GET /expenses
```

### Despesas Pendentes de Categoria Específica
```bash
GET /expenses?status=PENDING&category=Alimentação
```

### Despesas com Múltiplos Filtros
```bash
GET /expenses?status=PAID,PENDING&expenseType=FIXED&date=2025-08-01
```

### Estatísticas do Mês Atual
```bash
GET /expenses/monthly-stats
```

### Estatísticas de Mês Específico
```bash
GET /expenses/monthly-stats?month=2025-07
```

### Criar Despesa Simples
```bash
POST /expenses
{
  "name": "Conta de Luz",
  "expenseType": "FIXED",
  "amount": 150.50,
  "paymentMethod": "Débito Automático",
  "status": "PENDING",
  "spentAt": "2025-08-01T10:00:00Z",
  "category": "Utilidades"
}
```

### Criar Despesa Parcelada
```bash
POST /expenses
{
  "name": "Notebook Dell",
  "expenseType": "VARIABLE",
  "amount": 2400.00,
  "paymentMethod": "Cartão de Crédito",
  "status": "PENDING",
  "spentAt": "2025-08-01T14:30:00Z",
  "category": "Tecnologia",
  "installmentsCount": 12
}
```

### Atualizar Status da Despesa
```bash
PATCH /expenses/clx123456789
{
  "status": "PAID"
}
```

### Reconfigurar Parcelamentos
```bash
PATCH /expenses/clx123456789
{
  "amount": 2000.00,
  "installmentsCount": 10
}
```

### Atualizar Status de uma Parcela
```bash
PATCH /expenses/installments/clx987654321
{
  "status": "PAID"
}
```

### Alterar Data de Vencimento de uma Parcela
```bash
PATCH /expenses/installments/clx987654321
{
  "dueDate": "2025-09-15T00:00:00Z"
}
```

### Atualizar Parcela Completamente
```bash
PATCH /expenses/installments/clx987654321
{
  "dueDate": "2025-09-20T00:00:00Z",
  "status": "PAID"
}
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Controle completo de despesas pessoais
- ✅ Gestão de gastos fixos e variáveis
- ✅ Sistema robusto de parcelamentos
- ✅ Atualização independente de parcelas
- ✅ Estatísticas mensais para análise financeira
- ✅ Filtros avançados para busca específica
- ✅ Integração com categorias e métodos de pagamento
- ✅ Controle de status (pago/pendente)
- ✅ Histórico completo com paginação

## ⚠️ Regras de Negócio

### **Parcelamentos**
- Valor mínimo por parcela: R$ 0,01
- Parcelas são criadas com vencimento mensal sequencial
- Última parcela ajustada para exato fechamento do valor total
- Recriação completa de parcelas ao alterar quantidade ou valor
- Parcelas podem ser atualizadas individualmente (data e status)
- Status de parcela independente do status da despesa principal

### **Tipos de Despesa**
- **FIXED**: Despesas recorrentes (aluguel, conta de luz, etc.)
- **VARIABLE**: Despesas pontuais (compras, lazer, etc.)

### **Status de Despesa**
- **PENDING**: Despesa ainda não paga
- **PAID**: Despesa já quitada

### **Relacionamentos**
- Categorias são criadas automaticamente se não existirem
- Métodos de pagamento são criados automaticamente se não existirem
- Exclusão de despesa remove todas as parcelas associadas

### **Validações**
- Valor deve ser positivo
- Data de gasto obrigatória
- Nome e categoria obrigatórios
- Método de pagamento obrigatório
