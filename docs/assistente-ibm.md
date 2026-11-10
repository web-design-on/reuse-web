# Assistente IBM para o ReUse

Este roteiro adapta o PDF `Guia-watsonx-Orchestrate-ReUse.pdf` ao código deste repositório. O objetivo é usar **AI Assistant Builder, Actions, extensão OpenAPI e Web Chat**. Não é necessário criar um agente. A disponibilidade e os nomes dos menus dependem da conta e da versão da IBM.

## O que já existe

- `listActiveOffers`: lista até 50 ofertas ativas da conta autenticada. O campo `total` é a quantidade retornada, não necessariamente o total no banco.
- `pauseOffers`: pausa todas as ofertas ativas da conta ou as ofertas especificadas por ID. A confirmação deve ser configurada na Action antes de executar a operação.
- O Web Chat recebe uma identidade assinada e um token de ação privado. As APIs verificam a identidade, a chave da extensão e o proprietário das ofertas.
- O Web Chat só aparece para usuários com login. Assim, o teste anônimo descrito no PDF ainda não é atendido. Não desative a segurança para contornar isso.
- Não existem neste projeto uma operação de reativação, uma tela de cadastro de anúncios ou uma integração de voz. Não configure respostas dizendo que essas funções já estão disponíveis. A exigência de voz precisa ser confirmada com o professor, pois aparece no título da atividade, mas não nos critérios detalhados.

Não volte commits: o commit mais recente já substituiu a integração de agente pelo Web Chat de assistente. O que falta é configurar e testar o assistente na IBM e publicar o código e as variáveis corretas.

## 1. Preparar o ambiente

1. Confirme o endereço HTTPS público do projeto na Vercel. Em `docs/chatbot-openapi.yaml` e `docs/chatbot-openapi.json`, confira `servers[0].url` e troque somente se for diferente do endereço público correto. Escolha um dos dois arquivos para importar na IBM; mantenha ambos equivalentes se editar o contrato.
2. Na Vercel, abra o projeto em **Settings > Environment Variables**. Configure `DATABASE_URL` e `SESSION_SECRET` para a aplicação, além de `ASSISTANT_ACTION_SECRET` e `ASSISTANT_EXTENSION_API_KEY`. Use segredos longos e diferentes entre si; gere cada um separadamente com `openssl rand -hex 32`.
3. Use um banco local ou de testes para demonstrações. Após configurar `DATABASE_URL`, rode `npx prisma migrate dev` e, se necessário, `npx prisma db seed`. O seed cria dados e contas de demonstração e não deve ser executado inadvertidamente em produção. Em produção, aplique as migrações com `npx prisma migrate deploy`.
4. Para testes locais, coloque as variáveis em `.env`, que não deve ser enviado ao Git. Não envie senhas, tokens ou chaves privadas pelo chat ou para o repositório.

## 2. Criar o assistente e a extensão

1. Entre no watsonx Orchestrate e procure **AI Assistant Builder** ou **Assistant Builder**. Em contas mais antigas o recurso pode aparecer como watsonx Assistant. Se só aparecer criação de agentes, procure o Builder ou verifique acesso e plano da conta; não substitua por um agente.
2. Crie um **assistente** em português do Brasil e use o ambiente de rascunho. Caso já exista um assistente correto, aproveite-o. Não apague o agente antigo antes de confirmar que o novo assistente funciona.
3. Em **Integrations > Extensions**, escolha **Build custom extension** e importe `docs/chatbot-openapi.yaml` ou `docs/chatbot-openapi.json`. Confirme que aparecem `listActiveOffers` e `pauseOffers`. Importar não basta: adicione a extensão ao assistente e ao ambiente usado no teste.
4. Configure a autenticação de API key da extensão no cabeçalho `X-ReUse-Extension-Key` com o mesmo valor privado de `ASSISTANT_EXTENSION_API_KEY`. Não coloque essa chave no OpenAPI, no navegador ou em mensagens.
5. Em cada chamada de operação da Action, associe `X-ReUse-Action-Token` ao campo privado `reuse_action_token` do payload do Web Chat, nunca a um ID fornecido pelo usuário. O PDF sugere `${system_integrations.chat.private.user_payload}.reuse_action_token`; a sintaxe e o seletor variam entre versões. Confirme no editor que o valor vem de `context.integrations.chat.private.user_payload.reuse_action_token`. Não exiba nem registre o valor. Se o editor não permitir acessar esse campo no cabeçalho, pare e verifique a compatibilidade da versão antes de enfraquecer a autenticação.

## 3. Criar as Actions

Crie uma Action **Consultar minhas ofertas**, com exemplos como “quais são minhas ofertas ativas?”, “mostre meus anúncios” e “listar minhas ofertas”. Adicione um passo para chamar `listActiveOffers`, com `limit` igual a 20 e o cabeçalho privado mapeado. Use `offers` e `total` da resposta para apresentar os itens retornados; se `total` for zero, informe que não há ofertas ativas. Quando houver 20 resultados, informe que a lista está limitada a 20, sem afirmar que há apenas 20 no total. Trate erros com uma mensagem para tentar novamente, sem exibir tokens.

Crie uma Action **Pausar minhas ofertas**, com exemplos como “quero pausar minhas ofertas ativas” e “pause todos os meus anúncios”. Configure os passos nesta ordem:

1. Chame `listActiveOffers` com o mesmo cabeçalho e `limit` de 20.
2. Se `total` for zero, informe que não há ofertas ativas e encerre. Se houver resultados, apresente-os como uma amostra de até 20, não como a quantidade total.
3. Pergunte: “Quer pausar **todas** as suas ofertas ativas agora, inclusive as que não aparecem nesta lista?” Use uma resposta fechada **Sim/Não**.
4. Somente no ramo **Sim**, chame `pauseOffers` com o cabeçalho privado e corpo `{ "pauseAll": true }`. No ramo **Não**, encerre sem chamar a operação.
5. Em caso de sucesso, use `pausedCount` para informar quantas ofertas foram pausadas; se for zero, informe que não havia ofertas ativas. Em caso de erro, informe que não foi possível concluir e não afirme que a pausa ocorreu.

Crie Actions de orientação independentes da extensão, com exemplos de perguntas e respostas como:

- **Como encontrar um produto?** “Abra Produtos, escolha uma categoria e selecione um item para ver os detalhes.”
- **Como salvar um favorito?** “Entre na sua conta, encontre um produto e selecione o coração. Você pode consultá-lo em Favoritos.”
- **Como usar o carrinho?** “Entre na sua conta, selecione Adicionar ao carrinho em um produto e abra Carrinho para conferir ou remover itens.”
- **Como cadastrar um item?** “O cadastro de anúncios ainda não está disponível nesta versão do ReUse.”

Inclua variações de frases para cada Action e teste também perguntas não reconhecidas. Não use dados públicos de contexto ou texto da conversa como prova de identidade: a API valida o token de ação no servidor.

## 4. Segurança e Web Chat

1. Em um diretório seguro fora do repositório, gere um par de chaves exclusivo para o Web Chat:

   ```bash
   openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out web-chat-private.pem
   openssl rsa -pubout -in web-chat-private.pem -out web-chat-public.pem
   ```

2. Em **Integrations > Web chat > Security**, habilite **Secure your web chat** e cole o conteúdo de `web-chat-public.pem` em **Your public key**. Gere a chave pública fornecida pela IBM em **Generate key** e copie-a. São chaves diferentes: uma verifica a assinatura do ReUse; a outra cifra os dados privados para a IBM.
3. Na Vercel, configure `ASSISTANT_WEB_CHAT_PRIVATE_KEY_BASE64` com a chave privada PEM inteira codificada em base64. No macOS, use `base64 < web-chat-private.pem | tr -d '\n'`. Guarde o arquivo e o resultado em segurança.
4. Configure `ASSISTANT_WEB_CHAT_IBM_PUBLIC_KEY_BASE64` com a chave pública da IBM em base64: se a IBM fornecer PEM, codifique o PEM inteiro da mesma forma; se fornecer uma chave DER já codificada em base64, use o valor fornecido. Não codifique duas vezes. A chave da IBM deve pertencer à integração do Web Chat utilizada.
5. Na aba de incorporação do Web Chat, copie `integrationID`, `region` e `serviceInstanceID` para `NEXT_PUBLIC_IBM_ASSISTANT_INTEGRATION_ID`, `NEXT_PUBLIC_IBM_ASSISTANT_REGION` e `NEXT_PUBLIC_IBM_ASSISTANT_SERVICE_INSTANCE_ID`. Configure também `NEXT_PUBLIC_IBM_ASSISTANT_WEB_CHAT_VERSION` como `latest`, ou a versão indicada pela IBM. Se o código de incorporação da sua instância exigir `subscriptionID`, o componente ainda precisa ser adaptado para incluí-lo.
6. Configure nome e saudação do assistente. Salve as variáveis na Vercel para o ambiente desejado e faça **Redeploy**: alterações de variáveis não atualizam deployments anteriores. Os valores `NEXT_PUBLIC_` são públicos; todas as chaves e segredos permanecem no servidor.

## 5. Publicar e testar

1. Publique uma versão do assistente e associe-a ao ambiente **Live**. Confirme que os IDs do Web Chat correspondem a esse ambiente. Com segurança ativada, o link compartilhável de preview não envia JWT; teste a integração pelo site autenticado.
2. Entre no ReUse com uma conta de teste e abra o Web Chat. Pergunte como encontrar produtos ou salvar favoritos e confira a orientação. O botão não aparecerá sem login na implementação atual.
3. Peça a lista de ofertas. Confirme que a resposta corresponde à conta. Se ela não tiver ofertas, teste com uma conta de demonstração que tenha ofertas ativas.
4. Solicite a pausa e responda **Não**. Confirme que as ofertas continuam no catálogo. Repita e responda **Sim**; confira `pausedCount` e confirme que os itens pausados saíram do catálogo. A pausa modifica o banco de dados; use somente dados de teste. A reativação não está implementada no projeto.
5. Saia, entre com outra conta e confira que a lista e a pausa não atingem as ofertas da primeira. Deixe o chat aberto por mais de dez minutos e repita a consulta para verificar a renovação do token.

## Diagnóstico

- **Chat não aparece:** confira login, IDs públicos, variáveis no ambiente correto e redeploy. Veja erros do navegador e da rota `/api/assistant/session` nos logs, sem compartilhar tokens.
- **401 na operação:** verifique a chave privada da extensão, o mapeamento do token de ação, sua expiração e o `ASSISTANT_ACTION_SECRET`. A sessão do site também precisa estar válida.
- **403 na pausa:** algum ID solicitado não pertence à conta ou não está ativo. A opção `pauseAll` não precisa de IDs.
- **404 na extensão:** confira o domínio e os caminhos no OpenAPI e faça novo deploy se necessário.
- **Funciona no rascunho, mas não no site:** publique Live e confira os IDs. Testes internos podem não fornecer o payload privado; valide as operações pelo Web Chat incorporado.
- **Falha de identidade ou criptografia:** confira o par de chaves de assinatura, a chave pública fornecida pela IBM e sua codificação. Não desligue a segurança nem passe o token pela conversa.

Referências oficiais: [segurança do Web Chat](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-security-enable), [dados privados criptografados](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-security-encrypt) e [identidade e logout](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-security-authenticate).