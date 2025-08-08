# 📊 Módulo Dashboard

Este módulo implementa as funcionalidades do dashboard financeiro da aplicação We Finance, fornecendo endpoints para métricas agregadas e visualizações de dados.

## 🚀 Funcionalidades

### 1. **Cards de Resumo** (`GET /dashboard/summary`)
Retorna métricas agregadas do período especificado:
- Total de receitas
- Total de despesas  
- Total de investimentos
- Saldo (receitas - despesas - investimentos)
- Período dos dados

### 2. **Despesas por Categoria** (`GET /dashboard/expenses-by-category`)
Retorna a distribuição percentual das despesas por categoria:
- Nome da categoria
- Valor total gasto
- Percentual do total

### 3. **Receitas vs Despesas** (`GET /dashboard/revenues-vs-expenses`)
Compara totais de receitas e despesas do período:
- Total de receitas
- Total de despesas
- Período dos dados

### 4. **Últimas Transações** (`GET /dashboard/transactions`)
Lista as últimas transações com paginação:
- Receitas, despesas e investimentos unificados
- Ordenação por data de criação (mais recentes primeiro)
- Paginação com `init` e `limit`
- Total de registros para controle de paginação

## 🔍 Filtros Disponíveis

Todos os endpoints aceitam os seguintes query parameters:

- **`userId`** (opcional): Filtra dados de um usuário específico
- **`month`** (opcional): Mês(es) para filtrar. Aceita múltiplos valores separados por vírgula
  - Exemplo: `janeiro,fevereiro,março`
- **`year`** (opcional): Ano(s) para filtrar. Aceita múltiplos valores separados por vírgula
  - Exemplo: `2024,2025`

### 📅 Comportamento Padrão
- **Sem parâmetros**: Retorna dados do mês e ano atual
- **Filtros combinados**: Permite consultas como "março e abril de 2024"

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
dashboard/
├── dashboard.module.ts           # Módulo NestJS
├── dashboard.repository.ts       # Camada de dados (queries SQL)
├── controllers/
│   └── dashboard.controller.ts   # Controller REST API
├── services/
│   └── dashboard.service.ts      # Lógica de negócio
└── dtos/
    ├── dashboard-filter.dto.ts       # Filtros comuns
    ├── transactions-filter.dto.ts    # Filtros com paginação
    └── dashboard-response.dto.ts     # Interfaces de resposta
```

## 💡 Características Técnicas

### **Performance Otimizada**
- Queries SQL raw para operações complexas
- Agregações em nível de banco de dados
- União eficiente de tabelas para transações

### **Flexibilidade de Filtros**
- Suporte a múltiplos meses e anos
- Conversão automática de nomes de meses para números
- Filtros por usuário opcional

### **Documentação Completa**
- Swagger/OpenAPI para todos os endpoints
- Exemplos de request/response
- Documentação detalhada de parâmetros

### **Segurança**
- AuthGuard aplicado em todas as rotas
- Validação de entrada com DTOs
- Queries parametrizadas para prevenir SQL injection

## 🔄 Exemplos de Uso

### Cards de Resumo - Mês Atual
```bash
GET /dashboard/summary
```

### Despesas por Categoria - Usuário Específico
```bash
GET /dashboard/expenses-by-category?userId=user-uuid-123
```

### Transações de Múltiplos Meses
```bash
GET /dashboard/transactions?month=janeiro,fevereiro&year=2025&limit=20
```

### Receitas vs Despesas - Ano Específico
```bash
GET /dashboard/revenues-vs-expenses?year=2024
```

## 📈 Casos de Uso

Este módulo atende perfeitamente aos requisitos do dashboard:
- ✅ Cards de resumo com métricas financeiras
- ✅ Gráfico de pizza para despesas por categoria
- ✅ Gráfico de barras para receitas vs despesas
- ✅ Tabela de últimas transações com paginação
- ✅ Filtros flexíveis por período e usuário
- ✅ Comportamento padrão para mês atual
