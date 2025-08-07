# 📁 Módulo Category

Este módulo implementa o gerenciamento de categorias da aplicação We Finance, permitindo organizar receitas, despesas e investimentos em grupos específicos.

## 🚀 Funcionalidades

### 1. **Listar Categorias** (`GET /categories`)
Retorna todas as categorias com filtros e paginação:
- Filtro por nome (busca insensível a maiúsculas/minúsculas)
- Filtro por tipo (INCOME, EXPENSE, INVESTMENT)
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)
- Total de registros para controle de paginação

### 2. **Criar Categoria** (`POST /categories`)
Cria uma nova categoria:
- Validação de nome único por tipo
- Prevenção de categorias duplicadas
- Tipos suportados: INCOME, EXPENSE, INVESTMENT

### 3. **Atualizar Categoria** (`PATCH /categories/:id`)
Atualiza uma categoria existente:
- Atualização parcial dos campos
- Manutenção da validação de unicidade

### 4. **Remover Categoria** (`DELETE /categories/:id`)
Remove uma categoria do sistema:
- Exclusão física do registro

## 🔍 Filtros Disponíveis

Todos os endpoints de listagem aceitam os seguintes query parameters:

- **`name`** (opcional): Filtra categorias por nome (busca parcial)
  - Exemplo: `?name=salário`
- **`type`** (opcional): Filtra por tipo de categoria
  - Valores aceitos: `INCOME`, `EXPENSE`, `INVESTMENT`
  - Exemplo: `?type=INCOME`
- **`init`** (opcional): Número da página para paginação (padrão: 0)
  - Exemplo: `?init=0`
- **`limit`** (opcional): Quantidade de registros por página
  - Exemplo: `?limit=10`

### 📅 Comportamento Padrão
- **Sem parâmetros**: Retorna todas as categorias ordenadas por data de criação
- **Paginação**: Se não especificada, retorna todos os registros

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
category/
├── category.module.ts              # Módulo NestJS
├── category.repository.ts          # Camada de dados (Prisma)
├── controllers/
│   └── category.controller.ts      # Controller REST API
├── services/
│   └── category.service.ts         # Lógica de negócio
└── dtos/
    ├── create-category.dto.ts      # DTO para criação
    ├── update-category.dto.ts      # DTO para atualização
    └── filter-category.dto.ts      # DTO para filtros
```

## 💡 Características Técnicas

### **Validação de Dados**
- Prevenção de categorias duplicadas (mesmo nome + tipo)
- Busca case-insensitive para nomes
- Validação de tipos enum

### **Performance Otimizada**
- Queries otimizadas com Prisma
- Paginação eficiente
- Contagem total separada para melhor performance

### **Documentação Completa**
- Swagger/OpenAPI para todos os endpoints
- Exemplos de request/response
- Documentação detalhada de parâmetros

### **Segurança**
- Validação de entrada com DTOs
- Queries parametrizadas para prevenir SQL injection
- Tratamento de erros específicos

## 🔄 Exemplos de Uso

### Listar Todas as Categorias
```bash
GET /categories
```

### Listar Categorias de Receita
```bash
GET /categories?type=INCOME
```

### Buscar Categoria por Nome
```bash
GET /categories?name=salário
```

### Categorias com Paginação
```bash
GET /categories?init=0&limit=10
```

### Criar Nova Categoria
```bash
POST /categories
{
  "name": "Freelance",
  "type": "INCOME"
}
```

### Atualizar Categoria
```bash
PATCH /categories/clm123456789
{
  "name": "Freelance - Desenvolvimento"
}
```

### Remover Categoria
```bash
DELETE /categories/clm123456789
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Organização de receitas por categoria (salário, freelance, etc.)
- ✅ Organização de despesas por categoria (alimentação, transporte, etc.)
- ✅ Organização de investimentos por categoria (ações, fundos, etc.)
- ✅ Busca e filtros flexíveis
- ✅ Prevenção de categorias duplicadas
- ✅ Interface intuitiva para gestão de categorias

## ⚠️ Regras de Negócio

### **Unicidade**
- Não é possível criar categorias com o mesmo nome e tipo
- A busca por duplicatas é case-insensitive

### **Tipos de Categoria**
- **INCOME**: Para categorização de receitas
- **EXPENSE**: Para categorização de despesas  
- **INVESTMENT**: Para categorização de investimentos

### **Exclusão**
- A exclusão de categoria pode afetar registros relacionados
- Recomenda-se verificar dependências antes da exclusão
