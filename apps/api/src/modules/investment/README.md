# 📈 Módulo Investment

Este módulo implementa o gerenciamento de investimentos da aplicação We Finance, permitindo controle de aplicações financeiras com filtros, estatísticas mensais e análise por usuário.

## 🚀 Funcionalidades

### 1. **Listar Investimentos** (`GET /investments`)
Retorna todos os investimentos com filtros e paginação:
- Filtro por valor específico
- Filtro por data de investimento (formato YYYY-MM-DD)
- Filtro por nome/descrição do investimento
- Filtro por usuário específico
- Filtro por categoria (ID)
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)

### 2. **Estatísticas Mensais** (`GET /investments/monthly-stats`)
Retorna estatísticas agregadas de investimentos para todos os usuários:
- Total investido no mês por todos os usuários
- Detalhamento por usuário (nome e valor investido)
- Suporte a filtro por mês específico (formato YYYY-MM)
- Padrão para mês atual se não especificado

### 3. **Criar Investimento** (`POST /investments`)
Cria um novo investimento:
- Criação automática de categoria se não existir
- Campos: nome, valor, data, observações, categoria
- Associação automática ao usuário autenticado
- Observações opcionais para detalhes adicionais

### 4. **Atualizar Investimento** (`PATCH /investments/:id`)
Atualiza um investimento existente:
- Atualização parcial dos campos
- Atualização automática de categoria se fornecida
- Criação automática de categoria se não existir

### 5. **Remover Investimento** (`DELETE /investments/:id`)
Remove um investimento do sistema:
- Exclusão física do registro

## 🔍 Filtros Disponíveis

### **Filtros de Listagem** (`GET /investments`)
- **`amount`** (opcional): Filtra por valor específico
- **`investedAt`** (opcional): Filtra por data específica (formato YYYY-MM-DD)
- **`notes`** (opcional): Busca por nome/descrição do investimento
- **`userId`** (opcional): Filtra por usuário específico
- **`categoryId`** (opcional): Filtra por categoria específica (ID)
- **`init`** (opcional): Número da página (padrão: 0)
- **`limit`** (opcional): Registros por página

### **Filtros de Estatísticas** (`GET /investments/monthly-stats`)
- **`month`** (opcional): Mês no formato YYYY-MM (padrão: mês atual)

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
investment/
├── investment.module.ts            # Módulo NestJS
├── investment.repository.ts        # Camada de dados (Prisma)
├── controllers/
│   └── investment.controller.ts    # Controller REST API
├── services/
│   └── investment.service.ts       # Lógica de negócio
└── dtos/
    ├── create-investment.dto.ts    # DTO para criação
    ├── update-investment.dto.ts    # DTO para atualização
    ├── filter-investment.dto.ts    # DTO para filtros
    └── monthly-stats.dto.ts        # DTO para estatísticas
```

## 💡 Características Técnicas

### **Gestão Automática de Relacionamentos**
- Criação automática de categorias inexistentes (tipo INVESTMENT)
- Validação de tipos de categoria adequados
- Associação automática ao usuário autenticado

### **Filtros Básicos**
- Busca por valor exato
- Filtro por data específica com range preciso
- Busca textual em observações/nome
- Filtros por IDs específicos

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

### **Estatísticas Detalhadas**
- Agregação por mês
- Detalhamento por usuário
- Total geral e individual
- Suporte a períodos específicos

## 🔄 Exemplos de Uso

### Listar Todos os Investimentos
```bash
GET /investments
```

### Investimentos de Usuário Específico
```bash
GET /investments?userId=user-uuid-123
```

### Investimentos por Data
```bash
GET /investments?investedAt=2025-08-01
```

### Investimentos com Paginação
```bash
GET /investments?init=0&limit=5
```

### Estatísticas do Mês Atual
```bash
GET /investments/monthly-stats
```

### Estatísticas de Mês Específico
```bash
GET /investments/monthly-stats?month=2025-07
```

### Criar Investimento em Ações
```bash
POST /investments
{
  "name": "Ações da Vale",
  "amount": 2500.00,
  "investedAt": "2025-08-01T10:00:00Z",
  "notes": "Compra de 100 ações",
  "category": "Ações"
}
```

### Criar Investimento em Fundo
```bash
POST /investments
{
  "name": "Tesouro Direto IPCA+",
  "amount": 1000.00,
  "investedAt": "2025-08-01T14:30:00Z",
  "category": "Renda Fixa"
}
```

### Atualizar Valor do Investimento
```bash
PATCH /investments/investment-uuid-123
{
  "amount": 3000.00,
  "notes": "Aporte adicional"
}
```

### Atualizar Categoria
```bash
PATCH /investments/investment-uuid-123
{
  "category": "Fundos Imobiliários"
}
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Controle de aplicações financeiras
- ✅ Registro de diferentes tipos de investimento
- ✅ Estatísticas mensais por usuário
- ✅ Filtros para busca específica
- ✅ Integração automática com categorias
- ✅ Histórico completo com paginação
- ✅ Observações detalhadas para cada investimento

## ⚠️ Regras de Negócio

### **Campos Obrigatórios**
- **Nome**: Identificação do investimento
- **Valor**: Quantia investida (deve ser positiva)
- **Data**: Data da aplicação
- **Categoria**: Tipo de investimento

### **Campos Opcionais**
- **Observações**: Detalhes adicionais, estratégia, etc.

### **Relacionamentos**
- Categorias são criadas automaticamente se não existirem (tipo INVESTMENT)
- Investimentos são sempre associados ao usuário autenticado
- Exclusão de investimento não afeta outras entidades

### **Validações**
- Valor deve ser positivo
- Data de investimento obrigatória
- Nome/descrição obrigatório
- Categoria obrigatória

### **Estatísticas**
- Calculadas para todos os usuários do sistema
- Agrupadas por mês de investimento
- Detalhamento individual por usuário
- Mês atual como padrão se não especificado

### **Filtros**
- Filtro por valor: busca exata
- Filtro por data: dia específico
- Filtro por observações: busca textual
- Filtros por ID: busca exata

### **Categorias Comuns**
- Ações
- Fundos Imobiliários
- Renda Fixa
- Tesouro Direto
- Fundos de Investimento
- Cripto Moedas
- Previdência Privada
