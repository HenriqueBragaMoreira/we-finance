# 💵 Módulo Income

Este módulo implementa o gerenciamento de receitas da aplicação We Finance, permitindo controle completo de ganhos com filtros avançados, estatísticas mensais e gestão de diferentes tipos de receita.

## 🚀 Funcionalidades

### 1. **Listar Receitas** (`GET /incomes`)
Retorna todas as receitas com filtros avançados e paginação:
- Filtro por descrição (busca insensível a maiúsculas/minúsculas)
- Filtro por categoria (suporte a múltiplas categorias separadas por vírgula)
- Filtro por valor específico
- Filtro por método de pagamento (suporte a múltiplos separados por vírgula)
- Filtro por status (PENDING, RECEIVED) - suporte a múltiplos
- Filtro por tipo de receita (FIXED, VARIABLE) - suporte a múltiplos
- Filtro por data específica (formato YYYY-MM-DD)
- Filtro por usuário
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)

### 2. **Buscar Receita por ID** (`GET /incomes/:id`)
Retorna uma receita específica com todos os detalhes:
- Informações completas da receita
- Dados do usuário, categoria e método de pagamento
- Retorna `null` se não encontrada

### 3. **Estatísticas Mensais** (`GET /incomes/monthly-stats`)
Retorna estatísticas agregadas de receitas para todos os usuários:
- Total de receitas do mês
- Total de receitas recebidas
- Total de receitas pendentes
- Suporte a filtro por mês específico (formato YYYY-MM)
- Padrão para mês atual se não especificado

### 4. **Criar Receita** (`POST /incomes`)
Cria uma nova receita com funcionalidades avançadas:
- Criação automática de categoria se não existir
- Criação automática de método de pagamento se não existir
- Tipos: FIXED (fixo) ou VARIABLE (variável)
- Status: PENDING ou RECEIVED
- Associação automática ao usuário autenticado

### 5. **Atualizar Receita** (`PATCH /incomes/:id`)
Atualiza uma receita existente:
- Atualização parcial dos campos
- Atualização automática de categoria/método de pagamento
- Criação automática se categoria/método não existir
- Retorna a receita atualizada com relacionamentos

### 6. **Remover Receita** (`DELETE /incomes/:id`)
Remove uma receita do sistema:
- Exclusão física do registro

## 🔍 Filtros Disponíveis

### **Filtros de Listagem** (`GET /incomes`)
- **`description`** (opcional): Busca por nome/descrição da receita
- **`category`** (opcional): Filtra por categoria - aceita múltiplas: `Salário,Vendas`
- **`amount`** (opcional): Filtra por valor específico
- **`paymentMethod`** (opcional): Filtra por método - aceita múltiplos: `PIX,Transferência`
- **`status`** (opcional): Filtra por status - aceita múltiplos: `RECEIVED,PENDING`
- **`incomeType`** (opcional): Filtra por tipo - aceita múltiplos: `FIXED,VARIABLE`
- **`date`** (opcional): Filtra por data específica (formato YYYY-MM-DD)
- **`userId`** (opcional): Filtra por usuário específico
- **`init`** (opcional): Número da página (padrão: 0)
- **`limit`** (opcional): Registros por página

### **Filtros de Estatísticas** (`GET /incomes/monthly-stats`)
- **`month`** (opcional): Mês no formato YYYY-MM (padrão: mês atual)

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
income/
├── income.module.ts                # Módulo NestJS
├── income.repository.ts            # Camada de dados (Prisma)
├── controllers/
│   └── income.controller.ts        # Controller REST API
├── services/
│   └── income.service.ts           # Lógica de negócio
└── dtos/
    ├── create-income.dto.ts        # DTO para criação
    ├── update-income.dto.ts        # DTO para atualização
    ├── filter-income.dto.ts        # DTO para filtros
    └── monthly-stats.dto.ts        # DTO para estatísticas
```

## 💡 Características Técnicas

### **Gestão Automática de Relacionamentos**
- Criação automática de categorias inexistentes (tipo INCOME)
- Criação automática de métodos de pagamento
- Validação de tipos de categoria adequados

### **Filtros Flexíveis**
- Suporte a múltiplos valores separados por vírgula
- Busca case-insensitive para descrições
- Filtros de data com range preciso (dia completo)
- Combinação inteligente de múltiplos filtros

### **Performance Otimizada**
- Queries otimizadas com includes seletivos
- Paginação eficiente
- Contagem total separada para melhor performance
- Conversão adequada de tipos Decimal para Number

### **Segurança e Autenticação**
- AuthGuard aplicado em todas as rotas
- Integração com Better Auth para sessões
- Validação de entrada com DTOs
- Queries parametrizadas para prevenir SQL injection

### **Tratamento de Dados**
- Conversão automática de valores Decimal do Prisma para Number
- Formatação adequada de respostas
- Sanitização de dados de relacionamentos

## 🔄 Exemplos de Uso

### Listar Todas as Receitas
```bash
GET /incomes
```

### Receitas Recebidas de Categorias Específicas
```bash
GET /incomes?status=RECEIVED&category=Salário,Freelance
```

### Receitas com Múltiplos Filtros
```bash
GET /incomes?status=PENDING&incomeType=FIXED&paymentMethod=PIX
```

### Buscar Receita Específica
```bash
GET /incomes/income-uuid-123
```

### Estatísticas do Mês Atual
```bash
GET /incomes/monthly-stats
```

### Estatísticas de Mês Específico
```bash
GET /incomes/monthly-stats?month=2025-07
```

### Criar Receita Fixa
```bash
POST /incomes
{
  "name": "Salário de Agosto",
  "incomeType": "FIXED",
  "category": "Salário",
  "amount": 4500.00,
  "paymentMethod": "PIX",
  "status": "RECEIVED",
  "receivedAt": "2025-08-01T10:00:00Z"
}
```

### Criar Receita Variável
```bash
POST /incomes
{
  "name": "Freelance - Desenvolvimento Web",
  "incomeType": "VARIABLE",
  "category": "Freelance",
  "amount": 1200.00,
  "paymentMethod": "Transferência Bancária",
  "status": "PENDING",
  "receivedAt": "2025-08-15T14:30:00Z"
}
```

### Atualizar Status da Receita
```bash
PATCH /incomes/income-uuid-123
{
  "status": "RECEIVED"
}
```

### Atualizar Múltiplos Campos
```bash
PATCH /incomes/income-uuid-123
{
  "amount": 5000.00,
  "paymentMethod": "PIX",
  "status": "RECEIVED"
}
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Controle completo de receitas pessoais
- ✅ Gestão de ganhos fixos e variáveis
- ✅ Estatísticas mensais para análise financeira
- ✅ Filtros avançados para busca específica
- ✅ Integração automática com categorias e métodos de pagamento
- ✅ Controle de status (recebido/pendente)
- ✅ Histórico completo com paginação
- ✅ Busca individual por ID

## ⚠️ Regras de Negócio

### **Tipos de Receita**
- **FIXED**: Receitas recorrentes (salário, pensão, aluguel recebido)
- **VARIABLE**: Receitas pontuais (freelance, vendas, bonificações)

### **Status de Receita**
- **PENDING**: Receita ainda não recebida
- **RECEIVED**: Receita já creditada

### **Relacionamentos**
- Categorias são criadas automaticamente se não existirem (tipo INCOME)
- Métodos de pagamento são criados automaticamente se não existirem
- Receitas são sempre associadas ao usuário autenticado

### **Validações**
- Valor deve ser positivo
- Data de recebimento obrigatória
- Nome e categoria obrigatórios
- Método de pagamento obrigatório
- Tipo de receita obrigatório

### **Filtros Múltiplos**
- Categorias: `?category=Salário,Freelance,Vendas`
- Métodos de pagamento: `?paymentMethod=PIX,Transferência,Cartão`
- Status: `?status=RECEIVED,PENDING`
- Tipos: `?incomeType=FIXED,VARIABLE`

### **Estatísticas**
- Calculadas para todos os usuários do sistema
- Agrupadas por mês
- Separadas por status (recebida/pendente)
- Mês atual como padrão se não especificado
