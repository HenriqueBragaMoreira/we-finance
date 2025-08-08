# Health Check Module

Este módulo foi criado para manter a API ativa no Render e o banco de dados ativo no Supabase, evitando que sejam desativados por inatividade.

## Funcionalidades

### 1. Health Check Endpoint
- **URL**: `GET /health`
- **Descrição**: Verifica se a API está funcionando e se o banco de dados está conectado
- **Resposta de sucesso**:
```json
{
  "status": "ok",
  "timestamp": "2025-08-08T14:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "message": "API está funcionando e banco de dados conectado"
}
```

### 2. Ping Endpoint
- **URL**: `GET /health/ping`
- **Descrição**: Endpoint simples para manter a API ativa
- **Resposta**:
```json
{
  "status": "pong",
  "timestamp": "2025-08-08T14:30:00.000Z",
  "message": "API está ativa"
}
```

### 3. Cronjob Automático
- **Frequência**: A cada 14 minutos
- **Descrição**: Faz uma requisição automática para o endpoint `/health/ping` para manter a API ativa
- **Log**: Registra no console quando o ping é executado

## Como Usar

### Configuração para Produção

1. **Defina a variável de ambiente `BASE_URL`** no Render:
   ```
   BASE_URL=https://sua-api.onrender.com
   ```

2. **O cronjob será executado automaticamente** a cada 14 minutos quando a aplicação estiver rodando.

### Monitoramento

Os logs do sistema podem ser visualizados no console da aplicação:
- `Executando ping automático para manter API ativa...`
- `Ping executado com sucesso: API está ativa`
- `Health check executado com sucesso - API e banco OK`

### Testando Localmente

Para testar o health check localmente:

```bash
# Testar health check
curl http://localhost:3333/health

# Testar ping
curl http://localhost:3333/health/ping
```

## Cronograma

O cronjob usa o padrão cron `"0 */14 * * * *"` que significa:
- `0` segundos
- `*/14` a cada 14 minutos  
- `*` qualquer hora
- `*` qualquer dia do mês
- `*` qualquer mês
- `*` qualquer dia da semana

Isso garante que a API seja "pingada" antes dos 15 minutos de inatividade que causam a desativação no Render.
