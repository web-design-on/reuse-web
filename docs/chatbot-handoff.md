# Handoff da Pessoa 1

Este documento resume o que foi entregue no backend para a integracao do assistente virtual e o que a proxima pessoa precisa usar.

## Entregue na Pessoa 1

- Modelo de dados atualizado para suportar ofertas do usuario com status ACTIVE e PAUSED.
- Seed com usuarios de teste e ofertas vinculadas a esses usuarios.
- Duas rotas de API para o chatbot:
  - POST /api/chatbot/offers/list-active
  - POST /api/chatbot/offers/pause
- Contrato OpenAPI em docs/chatbot-openapi.yaml.
- Migracao Prisma versionada em prisma/migrations/20261008000100_init_chatbot_offers/migration.sql.

## Arquivos principais

- prisma/schema.prisma
- prisma/seed.js
- app/api/chatbot/_shared.ts
- app/api/chatbot/offers/list-active/route.ts
- app/api/chatbot/offers/pause/route.ts
- docs/chatbot-openapi.yaml

## Como a autenticacao funciona hoje

- As rotas usam a sessao atual da aplicacao web.
- O usuario autenticado eh lido pelo cookie reuse_user_id.
- Isso significa que, do jeito atual, a chamada funciona melhor quando parte da propria aplicacao web.

## Usuarios de teste do seed

- usuario: sarah
- usuario: rebeca
- usuario: stephanie
- senha para todos: reuse123

## Payloads esperados

### Listar ofertas ativas

POST /api/chatbot/offers/list-active

Body opcional:

```json
{
  "limit": 10
}
```

### Pausar ofertas

POST /api/chatbot/offers/pause

Opcao 1:

```json
{
  "pauseAll": true
}
```

Opcao 2:

```json
{
  "offerIds": [1, 2, 3]
}
```

## O que a proxima pessoa precisa fazer

- Subir o banco com DATABASE_URL configurada.
- Rodar npx prisma migrate dev.
- Rodar npx prisma db seed.
- Publicar a aplicacao ou usar uma URL acessivel para o IBM Watson.
- Importar docs/chatbot-openapi.yaml no Watson.
- Configurar as actions para consumir essas duas rotas.

## Pendencia conhecida

- Ainda nao foi possivel validar migrate e seed em banco real neste ambiente porque DATABASE_URL nao estava disponivel para o Prisma CLI.