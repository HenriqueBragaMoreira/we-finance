# 👤 Módulo User

Este módulo implementa o gerenciamento de usuários da aplicação We Finance, fornecendo funcionalidades para listagem, busca e estatísticas detalhadas dos usuários do sistema.

## 🚀 Funcionalidades

### 1. **Listar Usuários** (`GET /users`)
Retorna todos os usuários do sistema com filtros e paginação:
- Filtro por nome (busca insensível a maiúsculas/minúsculas)
- Filtro por email (busca insensível a maiúsculas/minúsculas)  
- Filtro por status de verificação de email (true/false)
- Paginação com `init` e `limit`
- Ordenação por data de criação (mais recentes primeiro)
- Total de registros para controle de paginação
- Contadores de relacionamentos (_count)

### 2. **Buscar Usuário por ID** (`GET /users/by-id?id=uuid`)
Retorna um usuário específico com estatísticas detalhadas:
- Informações completas do usuário
- **Contadores de relacionamentos**: receitas, despesas, investimentos, sessões, contas
- **Estatísticas financeiras**: totais e quantidades por categoria
- Retorna erro 404 se não encontrado
- Validação obrigatória do parâmetro ID

## 🔍 Filtros Disponíveis

### **Filtros de Listagem** (`GET /users`)
- **`name`** (opcional): Filtra usuários por nome (busca parcial)
  - Exemplo: `?name=João`
- **`email`** (opcional): Filtra usuários por email (busca parcial)
  - Exemplo: `?email=gmail.com`
- **`emailVerified`** (opcional): Filtra por status de verificação
  - Valores aceitos: `true`, `false`
  - Exemplo: `?emailVerified=true`
- **`init`** (opcional): Número da página (padrão: 0)
  - Exemplo: `?init=0`
- **`limit`** (opcional): Registros por página
  - Exemplo: `?limit=10`

### **Filtros de Busca Individual** (`GET /users/by-id`)
- **`id`** (obrigatório): ID único do usuário
  - Exemplo: `?id=user-uuid-123`

## 🏗️ Arquitetura

O módulo segue os padrões da aplicação:

```
user/
├── user.module.ts                # Módulo NestJS
├── user.repository.ts            # Camada de dados (Prisma)
├── controllers/
│   └── user.controller.ts        # Controller REST API
├── services/
│   └── user.service.ts           # Lógica de negócio
└── dtos/
    ├── filter-user.dto.ts        # DTO para filtros de listagem
    └── get-user-by-id.dto.ts     # DTO para busca por ID
```

## 💡 Características Técnicas

### **Estatísticas Avançadas**
- Contadores automáticos de relacionamentos via Prisma
- Estatísticas financeiras calculadas em tempo real
- Totais agregados por tipo de transação
- Performance otimizada com queries paralelas

### **Filtros Flexíveis**
- Busca case-insensitive para nome e email
- Filtro booleano para verificação de email
- Suporte a busca parcial por string
- Paginação eficiente

### **Performance Otimizada**
- Queries otimizadas com includes seletivos
- Contagem total separada para melhor performance
- Execução paralela de queries para estatísticas
- Conversão adequada de tipos Decimal para Number

### **Segurança e Autenticação**
- AuthGuard aplicado em todas as rotas
- Validação de entrada com DTOs
- Queries parametrizadas para prevenir SQL injection
- Tratamento específico de usuários não encontrados

### **Documentação Detalhada**
- Swagger/OpenAPI completo
- Exemplos detalhados de responses
- Casos de erro documentados
- Tag específica para organização

## 🔄 Exemplos de Uso

### Listar Todos os Usuários
```bash
GET /users
```

### Listar Usuários Verificados
```bash
GET /users?emailVerified=true
```

### Buscar Usuários por Nome
```bash
GET /users?name=João
```

### Buscar Usuários por Domínio de Email
```bash
GET /users?email=gmail.com
```

### Usuários com Paginação
```bash
GET /users?init=0&limit=5
```

### Buscar Usuário Específico com Estatísticas
```bash
GET /users/by-id?id=user-uuid-123
```

### Filtros Combinados
```bash
GET /users?emailVerified=true&name=Silva&limit=20
```

## 📊 Estrutura de Resposta

### **Listagem de Usuários** (`GET /users`)
```json
{
  "data": [
    {
      "id": "user-uuid-123",
      "name": "João Silva",
      "email": "joao@email.com",
      "emailVerified": true,
      "image": "https://avatar.url",
      "createdAt": "2025-08-04T10:00:00.000Z",
      "updatedAt": "2025-08-04T10:00:00.000Z"
    }
  ],
  "totalLength": 150
}
```

### **Usuário com Estatísticas** (`GET /users/by-id`)
```json
{
  "id": "user-uuid-123",
  "name": "João Silva",
  "email": "joao@email.com",
  "emailVerified": true,
  "image": "https://avatar.url",
  "createdAt": "2025-08-04T10:00:00.000Z",
  "updatedAt": "2025-08-04T10:00:00.000Z",
  "_count": {
    "incomes": 25,
    "expenses": 50,
    "investments": 10,
    "sessions": 3,
    "accounts": 2
  },
  "stats": {
    "incomes": {
      "total": 15000.50,
      "count": 25
    },
    "expenses": {
      "total": 8500.75,
      "count": 50
    },
    "investments": {
      "total": 5000.00,
      "count": 10
    }
  }
}
```

## 📈 Casos de Uso

Este módulo atende aos seguintes requisitos:
- ✅ Administração de usuários do sistema
- ✅ Busca e filtros flexíveis para usuários
- ✅ Estatísticas financeiras individuais por usuário
- ✅ Monitoramento de atividade (sessões, contas)
- ✅ Controle de verificação de email
- ✅ Análise de engajamento e uso da plataforma
- ✅ Suporte a painéis administrativos

## ⚠️ Regras de Negócio

### **Campos de Usuário**
- **ID**: Identificador único gerado automaticamente
- **Nome**: Nome completo do usuário
- **Email**: Email único para login/identificação
- **Email Verificado**: Status de verificação do email
- **Imagem**: URL do avatar (opcional)
- **Timestamps**: Data de criação e última atualização

### **Contadores Automáticos**
- **Receitas**: Quantidade de registros de income
- **Despesas**: Quantidade de registros de expense  
- **Investimentos**: Quantidade de registros de investment
- **Sessões**: Sessões ativas/históricas
- **Contas**: Contas de autenticação vinculadas

### **Estatísticas Financeiras**
- **Total por categoria**: Soma dos valores em cada tipo
- **Contagem por categoria**: Quantidade de registros em cada tipo
- **Cálculo em tempo real**: Sempre atualizados na consulta

### **Validações**
- ID obrigatório para busca individual
- Filtros opcionais para listagem
- Paginação com valores padrão
- Tratamento de usuários inexistentes

### **Filtros**
- **Nome**: Busca parcial, case-insensitive
- **Email**: Busca parcial, case-insensitive  
- **Email Verificado**: Valores exatos (true/false)
- **Paginação**: Suporte completo com contagem total

### **Casos de Erro**
- **400 Bad Request**: ID não fornecido na busca individual
- **404 Not Found**: Usuário não encontrado
- **401 Unauthorized**: Token de autenticação inválido

### **Dados Sensíveis**
- Senhas não são expostas nas respostas
- Apenas informações básicas do perfil
- Estatísticas agregadas sem detalhes transacionais
