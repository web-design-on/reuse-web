# Handoff da Pessoa 1

Este documento resume o que foi entregue no backend para a integracao do assistente virtual e o que a proxima pessoa precisa usar.

## Entregue 

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

- Chamadas feitas pela aplicacao web usam o cookie assinado `reuse_user_id`, validado com `SESSION_SECRET`.
- Chamadas servidor-a-servidor do Watson usam `Authorization: Bearer <CHATBOT_API_TOKEN>` e `X-ReUse-User-Id`.
- Configure valores distintos para `SESSION_SECRET` e `CHATBOT_API_TOKEN` no servidor; configure o segundo tambem nas credenciais do Watson. Nunca envie esses segredos ao navegador.
- O `X-ReUse-User-Id` precisa ser preenchido a partir do contexto autenticado da aplicacao. Nao aceite esse ID diretamente de texto enviado pelo usuario.
- Gere cada segredo com `openssl rand -hex 32` e mantenha os valores fora do repositorio. Configurar um novo `SESSION_SECRET` invalida sessoes antigas e exige novo login.

## Usuarios de teste do seed

- usuario: sarah
- usuario: rebeca
- usuario: natali
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

- Para conectar o IBM Watson, publicar a aplicacao e substituir a URL de exemplo em `docs/chatbot-openapi.yaml` pelo dominio publico.
- Configurar `SESSION_SECRET` no servidor e `CHATBOT_API_TOKEN` no servidor e nas credenciais do Watson.
- Importar `docs/chatbot-openapi.yaml` no Watson e configurar as actions para enviar o Bearer token e `X-ReUse-User-Id` confiavel.
- O ID deve vir do contexto autenticado da aplicacao; nao configure um ID fixo nem aceite o valor de texto livre do usuario.

## Validacao da Pessoa 1

- PostgreSQL 18 local instalado via Postgres.app; banco isolado `reuse_p1_test`.
- Migracao `20261008000100_init_chatbot_offers` aplicada e confirmada pelo Prisma.
- Seed configurado para 3 usuarios demo, 8 categorias e 34 ofertas. O seed preserva dados existentes.
- Testes HTTP passaram para autenticacao valida/invalida, usuario sem autenticacao, isolamento entre donos, payload invalido, pausa seletiva e pausa total.
- Os testes foram feitos localmente. A URL publica e os segredos de deploy ainda precisam ser configurados antes da integracao com o Watson.