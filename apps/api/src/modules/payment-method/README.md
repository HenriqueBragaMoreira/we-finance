# 💳 Módulo Payment Method

Este módulo implementa o gerenciamento de métodos de pagamento da aplicação We Finance, permitindo controle dos meios de pagamento utilizados em receitas e despesas com validações de integridade e verificações de uso.

## 🚀 Funcionalidades

### 1. **Listar Métodos de Pagamento** (`GET /payment-methods`)
Retorna todos os métodos de pagamento com filtros e paginação:
- Filtro por nome (busca insensível a maiúsculas/minúsculas)
- Filtro por status ativo (true/false)
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)
- Total de registros para controle de paginação

### 2. **Buscar por ID** (`GET /payment-methods/:id`)
Retorna um método de pagamento específico:
- Busca por ID único
- Retorna erro 404 se não encontrado
- Informações completas do método

### 3. **Verificar Uso** (`GET /payment-methods/:id/usage`)
Verifica se um método de pagamento está sendo usado:
- Indica se está em uso por transações
- Contagem de receitas que usam o método
- Contagem de despesas que usam o método
- Total de transações que usam o método
- Útil antes de tentar excluir um método

### 4. **Criar Método de Pagamento** (`POST /payment-methods`)
Cria um novo método de pagamento:
- Validação de nome único
- Status ativo padrão (true)
- Prevenção de métodos duplicados

### 5. **Atualizar Método de Pagamento** (`PATCH /payment-methods/:id`)
Atualiza um método existente:
- Atualização parcial dos campos
- Validação de nome único (exceto para si mesmo)
- Permite ativação/desativação

### 6. **Remover Método de Pagamento** (`DELETE /payment-methods/:id`)
Remove um método do sistema:
- **Proteção contra exclusão**: Não permite excluir se estiver em uso
- Sugere desativação como alternativa
- Exclusão física apenas para métodos não utilizados

## 🔍 Filtros Disponíveis

Todos os endpoints de listagem aceitam os seguintes query parameters:

- **`name`** (opcional): Filtra métodos por nome (busca parcial)
  - Exemplo: `?name=cartão`
- **`isActive`** (opcional): Filtra por status ativo
  - Valores aceitos: `true`, `false`
  - Exemplo: `?isActive=true`
- **`init`** (opcional): Número da página para paginação (padrão: 0)
  - Exemplo: `?init=0`
- **`limit`** (opcional): Quantidade de registros por página
  - Exemplo: `?limit=10`

### 📅 Comportamento Padrão
- **Sem parâmetros**: Retorna todos os métodos ordenados por data de criação
- **Paginação**: Se não especificada, retorna todos os registros

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
payment-method/
├── payment-method.module.ts              # Módulo NestJS
├── payment-method.repository.ts          # Camada de dados (Prisma)
├── controllers/
│   └── payment-method.controller.ts      # Controller REST API
├── services/
│   └── payment-method.service.ts         # Lógica de negócio
└── dtos/
    ├── create-payment-method.dto.ts      # DTO para criação
    ├── update-payment-method.dto.ts      # DTO para atualização
    └── filter-payment-method.dto.ts      # DTO para filtros
```

## 💡 Características Técnicas

### **Validação de Integridade**
- Prevenção de métodos duplicados (nome único)
- Verificação de uso antes da exclusão
- Busca case-insensitive para nomes
- Proteção contra exclusão de métodos em uso

### **Performance Otimizada**
- Queries otimizadas com Prisma
- Paginação eficiente
- Contagem total separada para melhor performance
- Verificação de uso com contadores separados

### **Documentação Completa**
- Swagger/OpenAPI para todos os endpoints
- Exemplos de request/response detalhados
- Documentação de casos de erro
- Tag específica para organização

### **Segurança**
- AuthGuard aplicado em todas as rotas
- Validação de entrada com DTOs
- Queries parametrizadas para prevenir SQL injection
- Tratamento específico de erros de conflito

### **Gestão de Estado**
- Campo `isActive` para desativação sem exclusão
- Suporte a ativação/desativação via PATCH
- Manutenção de histórico por não excluir métodos em uso

## 🔄 Exemplos de Uso

### Listar Todos os Métodos
```bash
GET /payment-methods
```

### Listar Apenas Métodos Ativos
```bash
GET /payment-methods?isActive=true
```

### Buscar Método por Nome
```bash
GET /payment-methods?name=pix
```

### Métodos com Paginação
```bash
GET /payment-methods?init=0&limit=5
```

### Buscar Método Específico
```bash
GET /payment-methods/cm0x1y2z3
```

### Verificar se Método está em Uso
```bash
GET /payment-methods/cm0x1y2z3/usage
```

### Criar Novo Método
```bash
POST /payment-methods
{
  "name": "Cartão de Crédito Visa",
  "isActive": true
}
```

### Criar Método Simples
```bash
POST /payment-methods
{
  "name": "PIX"
}
```

### Atualizar Nome do Método
```bash
PATCH /payment-methods/cm0x1y2z3
{
  "name": "Cartão de Débito Mastercard"
}
```

### Desativar Método
```bash
PATCH /payment-methods/cm0x1y2z3
{
  "isActive": false
}
```

### Remover Método (apenas se não estiver em uso)
```bash
DELETE /payment-methods/cm0x1y2z3
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Gestão centralizada de métodos de pagamento
- ✅ Prevenção de métodos duplicados
- ✅ Controle de ativação/desativação
- ✅ Verificação de integridade antes da exclusão
- ✅ Busca e filtros flexíveis
- ✅ Histórico preservado para métodos em uso
- ✅ Interface intuitiva para administração

## ⚠️ Regras de Negócio

### **Unicidade**
- Não é possível criar métodos com o mesmo nome
- A verificação é case-insensitive
- Validação aplicada tanto na criação quanto na atualização

### **Status Ativo**
- **true**: Método disponível para novas transações
- **false**: Método desativado, não aparece em formulários
- Padrão: `true` para novos métodos

### **Proteção de Integridade**
- Métodos em uso não podem ser excluídos
- Sistema força desativação como alternativa
- Verificação automática de uso em receitas e despesas

### **Exclusão**
- Só é permitida para métodos nunca utilizados
- Métodos com histórico devem ser desativados
- Erro detalhado indica quantidade de transações afetadas

### **Casos de Erro**
- **409 Conflict**: Nome já existe
- **404 Not Found**: Método não encontrado
- **400 Bad Request**: Tentativa de exclusão de método em uso

### **Métodos Comuns**
- PIX
- Cartão de Crédito
- Cartão de Débito
- Transferência Bancária
- Dinheiro
- Boleto
- Débito Automático
