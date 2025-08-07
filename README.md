# 💸 WeFinance

Plataforma full stack para gestão financeira pessoal e familiar: controle centralizado de **receitas, despesas e investimentos** com dashboards analíticos claros e colaborativos para todos os membros da família.

> Desenvolvido por **Henrique Braga** e compartilhado como projeto open-source.

---

## 🎯 Propósito
Ajudar famílias e casais a ganharem **clareza, organização e previsibilidade** sobre sua vida financeira em um único ambiente simples e moderno.

## 😰 Problemas Que Resolvemos
- Falta de visibilidade sobre para onde o dinheiro vai
- Dificuldade de compartilhamento e transparência entre membros
- Perda de prazos de pagamentos e recebimentos
- Falta de histórico estruturado para análise de padrões
- Dificuldade em acompanhar evolução de investimentos

## 💎 Valor Entregue
- Visão consolidada mensal de receitas, despesas e saldo
- Distribuição por categorias e tipos
- Controle de recorrências e parcelamentos
- Multiusuário (ambiente familiar) com associação de registros
- Base para planejamento e tomada de decisão

## 🚀 Principais Funcionalidades
- Autenticação segura multiusuário
- Gestão de receitas (simples, recorrentes)
- Controle de despesas (recorrentes, parceladas, métodos de pagamento)
- Registro de investimentos e tipos
- Dashboard analítico (gráficos, cards, tendências)
- Filtros e buscas combináveis
- Categorização abrangente

## 🏗️ Visão de Arquitetura
Monorepo com separação clara de responsabilidades.
```
we-finance/
├── apps/
│   ├── web/   # Frontend Next.js
│   └── api/   # Backend NestJS
├── packages/  # (futuro) módulos compartilhados
└── tools/     # Configurações e build tooling
```

## 📘 Documentação Técnica
Para detalhes aprofundados, consulte:
- Frontend: `apps/web/README.md`
- Backend: `apps/api/README.md`

## ⚡ Comece em 60 Segundos
```bash
# Clone
git clone https://github.com/HenriqueBragaMoreira/we-finance.git
cd we-finance

# Instala dependências
pnpm install

# Sobe banco (Docker)
cd apps/api && docker-compose up -d && cd ../..

# Copia envs de exemplo
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Executa tudo (root)
pnpm run dev
```
Acesse: Frontend http://localhost:3000 | API http://localhost:3333

## 🤝 Contribuição
Contribuições são bem-vindas! Abra uma issue para ideias maiores ou envie um PR direto para melhorias incrementais. Consulte os READMEs específicos para padrões técnicos.

## 👤 Autor
**Henrique Braga**  
- **GitHub**: [@HenriqueBragaMoreira](https://github.com/HenriqueBragaMoreira)
- **LinkedIn**: [Henrique Braga](https://www.linkedin.com/in/h-braga/)
- **Email**: shenrique40moreira@gmail.com

## 🏷️ Licença
MIT — Uso livre para estudar, adaptar e evoluir.

---
⭐ Gostou? Considere deixar uma estrela no repositório e acompanhar a evolução.
