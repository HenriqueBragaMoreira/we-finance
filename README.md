# 💸 WeFinance

**WeFinance** é uma aplicação full stack para gestão financeira pessoal e familiar, criada para que pessoas possam controlar de forma simples, organizada e eficiente suas finanças. A plataforma permite o registro de receitas, despesas, investimentos e fornece dashboards analíticos com visão mensal das finanças.

> Desenvolvido por Henrique Braga para controle pessoal e compartilhado com o mundo como projeto open-source.

---

## � Descrição Geral

O WeFinance é uma plataforma de controle financeiro que centraliza o gerenciamento de finanças pessoais e familiares em uma interface moderna e intuitiva. O sistema oferece funcionalidades completas para acompanhar receitas, despesas e investimentos, com dashboards analíticos que fornecem insights valiosos sobre a saúde financeira dos usuários.

## 🎯 Contexto e Motivação

O projeto nasceu da necessidade real de organizar as finanças familiares de forma compartilhada e eficiente. Muitos casais e famílias enfrentam dificuldades para:

- **Visibilidade financeira**: Não sabem exatamente quanto gastam por categoria
- **Organização compartilhada**: Falta de transparência entre os membros da família
- **Controle de pendências**: Perdem prazos de pagamentos e recebimentos
- **Planejamento**: Não conseguem visualizar tendências e padrões de gastos
- **Investimentos**: Dificuldade para acompanhar a evolução do patrimônio

O WeFinance resolve essas dores oferecendo uma solução centralizada, segura e de fácil uso para toda a família.

## 🚀 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Autenticação segura com email e senha
- Sessões gerenciadas com tokens seguros
- Verificação de IP e user-agent para maior segurança
- Suporte multi-usuário para famílias

### 💰 **Gestão de Receitas**
- Cadastro detalhado de receitas (salários, freelances, vendas, etc.)
- Classificação por tipos e categorias personalizáveis
- Controle de status (Pendente/Recebido)
- Suporte a receitas recorrentes mensais
- Diferentes métodos de recebimento (PIX, transferência, dinheiro, etc.)
- Associação com usuários específicos

### 💸 **Controle de Despesas**
- Registro completo de despesas com categorização
- Suporte a parcelamento com geração automática de parcelas
- Despesas recorrentes (contas fixas, assinaturas)
- Múltiplos métodos de pagamento
- Controle de status (Pendente/Pago)
- Identificação de quem realizou o pagamento

### 📈 **Acompanhamento de Investimentos**
- Cadastro de investimentos por tipo (CDB, ações, fundos, etc.)
- Acompanhamento de valores aplicados
- Registro de retorno esperado
- Notas e observações personalizadas
- Categorização por tipo de investimento

### 📊 **Dashboard Analítico**
- Visão geral consolidada das finanças
- Gráficos de pizza para distribuição por categorias
- Gráficos de barras para comparações temporais
- Cards com resumos de receitas, despesas e investimentos
- Transações recentes com status visual
- Filtros por período e usuário

### 🔍 **Sistema de Filtros e Busca**
- Tabelas interativas com filtros avançados
- Busca por múltiplos critérios simultaneamente
- Ordenação personalizada

## 📋 Regras de Negócio

### **Usuários e Autenticação**
- Cada usuário deve ter email único no sistema
- Senhas devem ter no mínimo 6 caracteres
- Sessões expiram automaticamente por segurança
- Múltiplos usuários podem acessar o mesmo ambiente familiar

### **Receitas**
- Receitas podem ser marcadas como recorrentes (repetição automática mensal)
- Status: Pendente (não recebida) ou Recebido
- Valor deve ser positivo e em formato decimal (até 2 casas)
- Data de recebimento obrigatória
- Associação obrigatória com usuário responsável

### **Despesas**
- Despesas podem ser parceladas em até N vezes
- Cada parcela gera registro automático com datas futuras
- Despesas recorrentes são replicadas mensalmente
- Status: Pendente (não paga) ou Pago
- Suporte a diferentes métodos de pagamento
- Categorização obrigatória para análises

### **Investimentos**
- Registro do valor investido na data da aplicação
- Acompanhamento do retorno esperado
- Classificação por tipos (renda fixa, variável, fundos, etc.)
- Observações livres para detalhes específicos

### **Categorização**
- Categorias são específicas por tipo (receita, despesa, investimento)
- Sistema permite criação de categorias personalizadas
- Categorias são obrigatórias para análises e relatórios

## 🏗️ Arquitetura

O WeFinance utiliza uma arquitetura **monorepo** moderna com separação clara entre frontend e backend:

### **Estrutura do Projeto**
```
we-finance/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── packages/         # Pacotes compartilhados
└── tools/           # Ferramentas de build e config
```

### **Frontend (apps/web)**
- **SPA (Single Page Application)** em Next.js 15
- **Server-Side Rendering** para otimização de performance
- **Route Protection** com middleware customizado
- **Component Library** baseada em shadcn/ui
- **State Management** via React hooks nativos

### **Backend (apps/api)**
- **API RESTful** construída em NestJS
- **ORM Prisma** para gerenciamento do banco de dados
- **Autenticação Stateless** com better-auth
- **Validation Layer** com Zod schemas
- **CORS** configurado para integração segura

### **Banco de Dados**
- **PostgreSQL** como banco principal
- **Migrations** automatizadas via Prisma
- **Relacionamentos** bem definidos entre entidades
- **Índices** otimizados para consultas frequentes

## �️ Stack Tecnológica

### **Frontend**
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 15.4.2 | Framework React com SSR/SSG |
| **React** | 19.1.0 | Biblioteca para interfaces |
| **TypeScript** | 5.x | Superset tipado do JavaScript |
| **Tailwind CSS** | 4.x | Framework de estilização |
| **shadcn/ui** | Latest | Biblioteca de componentes |
| **TanStack Table** | 8.21.3 | Tabelas interativas avançadas |
| **Recharts** | 2.15.4 | Gráficos e visualizações |
| **React Hook Form** | 7.60.0 | Gerenciamento de formulários |
| **Zod** | 4.0.5 | Validação de schemas |
| **Lucide React** | 0.525.0 | Ícones modernos |

### **Backend**
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NestJS** | 11.0.1 | Framework Node.js progressivo |
| **Prisma** | 6.12.0 | ORM moderno para TypeScript |
| **PostgreSQL** | Latest | Banco de dados relacional |
| **better-auth** | 1.3.4 | Autenticação moderna e segura |
| **TypeScript** | 5.x | Linguagem tipada |
| **Zod** | 4.0.5 | Validação de dados |

### **Ferramentas de Desenvolvimento**
| Ferramenta | Versão | Descrição |
|------------|--------|-----------|
| **Turbo** | 2.5.4 | Build system para monorepos |
| **PNPM** | 10.12.4 | Gerenciador de pacotes rápido |
| **Biome** | 2.0.6 | Linter e formatter unificado |
| **Docker** | Latest | Containerização para desenvolvimento |

### **Deploy e CI/CD**
- **Frontend**: Vercel (deploy automático)
- **Backend**: Render ou similar
- **Banco**: Supabase (PostgreSQL gerenciado)
- **Versionamento**: Git com GitHub

## 📦 Instalação e Execução

### **Pré-requisitos**
- Node.js 18+ instalado
- PNPM como gerenciador de pacotes
- PostgreSQL (ou Docker para desenvolvimento)
- Git para versionamento

### **1. Clone e Instalação**
```bash
# Clone o repositório
git clone https://github.com/HenriqueBragaMoreira/we-finance.git
cd we-finance

# Instale as dependências do monorepo
pnpm install
```

### **2. Configuração do Banco de Dados**

**Opção A: Docker (Recomendado para desenvolvimento)**
```bash
# Navegue até o diretório da API
cd apps/api

# Suba o banco PostgreSQL via Docker
docker-compose up -d

# Aguarde alguns segundos para o banco inicializar
```

**Opção B: PostgreSQL Local**
```bash
# Certifique-se de ter PostgreSQL rodando localmente
# Crie um banco de dados chamado 'wefinance'
createdb wefinance
```

### **3. Configuração das Variáveis de Ambiente**

**Backend (apps/api/.env)**
```bash
# Copie o arquivo de exemplo
cd apps/api
cp .env.example .env

# Configure as variáveis (exemplo para Docker)
DATABASE_URL="postgresql://docker:docker@localhost:5432/docker"
CLIENT_ORIGIN="http://localhost:3000"
```

**Frontend (apps/web/.env)**
```bash
# Copie o arquivo de exemplo
cd apps/web
cp .env.example .env

# Configure a URL da API
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

### **4. Configuração do Banco**
```bash
# Volte para o diretório da API
cd apps/api

# Execute as migrations
pnpm prisma migrate dev --name init

# (Opcional) Execute o seed para dados de exemplo
pnpm run db:seed
```

### **5. Executar a Aplicação**

**Desenvolvimento Completo (recomendado)**
```bash
# Na raiz do projeto, execute ambos os serviços
pnpm run dev
```

**Ou execute separadamente:**

**Backend**
```bash
cd apps/api
pnpm run dev
# Servidor rodará em http://localhost:3333
```

**Frontend**
```bash
cd apps/web
pnpm run dev
# Aplicação rodará em http://localhost:3000
```

### **6. Acesso ao Sistema**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3333
- **Dados de login** (se executou o seed):
  - Email: `henrique-braga@gmail.com`
  - Senha: `admin123!@#`

## 🔧 Scripts Úteis

### **Scripts do Monorepo (raiz)**
```bash
# Desenvolvimento de toda a aplicação
pnpm run dev

# Build de produção
pnpm run build

# Linting e formatação
pnpm run lint
```

### **Scripts do Backend (apps/api)**
```bash
# Desenvolvimento com hot reload
pnpm run dev

# Build para produção
pnpm run build

# Iniciar versão de produção
pnpm run start:prod

# Executar testes
pnpm run test
pnpm run test:e2e
pnpm run test:cov

# Gerenciamento do banco
pnpm prisma migrate dev --name <nome-da-migration>
pnpm prisma generate
pnpm prisma studio
pnpm run db:seed

# Linting e formatação
pnpm run lint
pnpm run format
```

### **Scripts do Frontend (apps/web)**
```bash
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Iniciar versão de produção
pnpm run start

# Verificação de tipos
pnpm run type-check

# Linting e formatação
pnpm run lint
pnpm run format
```

### **Scripts Úteis do Prisma**
```bash
# Gerar cliente do Prisma após mudanças no schema
pnpm prisma generate

# Aplicar migrations pendentes
pnpm prisma migrate deploy

# Reset completo do banco (cuidado!)
pnpm prisma migrate reset

# Visualizar dados no Prisma Studio
pnpm prisma studio

# Fazer backup do banco
pnpm prisma db push
```

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Aqui está como você pode ajudar:

### **1. Fork e Clone**
```bash
# Faça um fork do repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/we-finance.git
cd we-finance
```

### **2. Configuração do Ambiente**
```bash
# Instale as dependências
pnpm install

# Configure o ambiente de desenvolvimento
# (siga as instruções de instalação acima)
```

### **3. Desenvolvimento**
```bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Faça suas alterações e commits
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# Push para seu fork
git push origin feature/nova-funcionalidade
```

### **4. Pull Request**
- Abra um Pull Request descrevendo suas alterações
- Inclua screenshots se for uma mudança visual
- Certifique-se de que os testes passam
- Aguarde review e feedback

### **Diretrizes de Contribuição**
- **Commits**: Use conventional commits (feat, fix, docs, etc.)
- **Código**: Siga as configurações do Biome para formatação
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize a documentação quando necessário
- **Issues**: Sempre abra uma issue antes de grandes mudanças

### **Áreas para Contribuição**
- 🐛 **Bug fixes**: Correção de problemas reportados
- ✨ **Novas features**: Implementação de funcionalidades
- 📚 **Documentação**: Melhoria da documentação
- 🎨 **UI/UX**: Melhorias na interface
- ⚡ **Performance**: Otimizações de performance
- 🔧 **DevEx**: Melhorias na experiência de desenvolvimento

## 📞 Contato e Autoria

**Desenvolvido por:** Henrique Braga

### **Links de Contato**
- **GitHub**: [@HenriqueBragaMoreira](https://github.com/HenriqueBragaMoreira)
- **LinkedIn**: [Henrique Braga](https://www.linkedin.com/in/h-braga/)
- **Email**: shenrique40moreira@gmail.com

### **Sobre o Projeto**
O WeFinance é um projeto pessoal que surgiu da necessidade real de organizar as finanças familiares. Foi desenvolvido usando as melhores práticas e tecnologias modernas, servindo tanto como ferramenta útil quanto como showcase de habilidades técnicas.

**Licença**: MIT - Sinta-se livre para usar, modificar e distribuir.

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no GitHub!**
