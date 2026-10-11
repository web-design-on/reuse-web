# ♻️ ReUse Web

> A ReUse é uma plataforma dedicada a facilitar o reaproveitamento de objetos entre usuários, promovendo a sustentabilidade e o consumo consciente. Na versão web, a plataforma amplia essa experiência para o navegador, permitindo que usuários acompanhem suas conversas e combinem a reutilização de itens.

---

## 🚀 Tecnologias Utilizadas

- **Next.js** – Framework React para desenvolvimento da aplicação web;
- **React** – Biblioteca para construção da interface e dos componentes interativos;
- **TypeScript** – Superset do JavaScript que adiciona tipagem estática ao projeto;
- **Prisma** – ORM utilizado para modelar e acessar os dados da aplicação;
- **PostgreSQL** – Banco de dados relacional utilizado para armazenar conversas e mensagens;
- **CSS** – Estilização responsiva seguindo a identidade visual do ReUse.

---

## 🎨 Decisões de Interface e Organização da Aplicação

A interface web foi projetada para manter a identidade visual do aplicativo mobile ReUse, adaptando a experiência para telas maiores e para o uso em navegadores.

Algumas decisões importantes de design incluem:

- **Interface clara e responsiva**, adaptada para desktop e dispositivos móveis;
- **Uso da fonte Poppins**, mantendo a identidade visual do aplicativo;
- **Cor principal `#6B4EFF`**, utilizada nas mensagens enviadas e nos elementos de destaque;
- **Mensagens organizadas em bolhas**, diferenciando visualmente o usuário autenticado dos demais participantes;
- **Fundo claro `#F5F5F5`**, com bordas arredondadas e componentes inspirados no app mobile;
- **Componentes interativos**, permitindo listar conversas e enviar novas mensagens;
- **Separação entre interface e servidor**, usando Server Actions para acessar os dados com segurança.

---

## 🗂️ Estrutura do Projeto

```
app/
├── actions/
│   └── messages.ts       # Server Actions para listar e enviar mensagens
├── globals.css            # Estilos globais e identidade visual
├── layout.tsx             # Layout global e configuração da fonte Poppins
├── messages-client.tsx    # Interface interativa da conversa
└── page.tsx               # Página principal de mensagens

lib/
├── auth.ts                # Identificação do usuário autenticado
└── db.ts                  # Cliente singleton do Prisma

prisma/
└── schema.prisma          # Modelos de conversa e mensagem

public/                    # Arquivos públicos da aplicação
```

---

## ⚙️ Como Rodar o Projeto Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/web-design-on/reuse-web/
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd reuse-web
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure o banco de dados. Copie o arquivo `.env.example` para `.env` e informe a URL do PostgreSQL:

   ```bash
   cp .env.example .env
   ```

   Configure `SESSION_SECRET`, `ASSISTANT_ACTION_SECRET` e `ASSISTANT_EXTENSION_API_KEY` com valores distintos. Os dois últimos são usados para assinar o token de ação curto e autenticar a extensão. Configure as chaves base64 do Web Chat e os IDs públicos `NEXT_PUBLIC_IBM_ASSISTANT_INTEGRATION_ID`, `NEXT_PUBLIC_IBM_ASSISTANT_REGION`, `NEXT_PUBLIC_IBM_ASSISTANT_SERVICE_INSTANCE_ID` e `NEXT_PUBLIC_IBM_ASSISTANT_WEB_CHAT_VERSION`, conforme `Guia-watsonx-Orchestrate-ReUse.pdf`. Só os IDs e a versão usam o prefixo público; nunca exponha chaves ou tokens:

   ```bash
   openssl rand -hex 32
   ```

   Execute o comando uma vez para cada segredo. Após configurar `SESSION_SECRET`, todos os usuários precisarão entrar novamente.

5. Crie as tabelas do banco:

   ```bash
   npx prisma migrate dev
   ```

6. Popule categorias e produtos de exemplo:

   ```bash
   npx prisma db seed
   ```

   O seed também cria usuários de demonstração para testes do chatbot:

   - usuário: `sarah` | senha: `reuse123`
   - usuário: `rebeca` | senha: `reuse123`
   - usuário: `natali` | senha: `reuse123`

   O seed é aditivo e não apaga registros existentes, mas cria usuários e ofertas de demonstração. Use-o somente em banco local ou de testes.

7. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

8. Acesse `http://localhost:3000` no navegador.

## Chatbot

- Contrato OpenAPI do chatbot: `docs/chatbot-openapi.yaml`
- O app web autentica `POST /api/assistant/session` pela sessão e entrega ao Web Chat do AI Assistant Builder um JWT de identidade com payload privado. A extensão usa `X-ReUse-Extension-Key` e `X-ReUse-Action-Token` para as chamadas às APIs.
- A API deriva o ID do usuário do token de ação assinado, sem depender de `context.user_id` ou de texto da conversa. Consulte `Guia-watsonx-Orchestrate-ReUse.pdf` para configurar os segredos e o mapeamento das actions.

---

## 📨 Planejamento de Entregas

### Sprint 01 - Welcome to Hybrid (03/02 - 10/03)

A primeira sprint teve como objetivo estruturar o início do projeto ReUse, definindo sua identidade visual e criando a base da aplicação mobile.

### Sprint 02 - Aplicação Web

A segunda sprint tem como objetivo ampliar o projeto ReUse para a web, mantendo a experiência visual do aplicativo e preparando a aplicação para persistência de dados.

**Entregas da sprint:**

- Criação da aplicação web utilizando Next.js, React e TypeScript;
- Adaptação da identidade visual do ReUse para a versão web;
- Desenvolvimento da tela de mensagens com bolhas de conversa;
- Implementação do envio e da listagem de mensagens;
- Criação dos modelos de conversa e mensagem com Prisma e PostgreSQL;
- Preparação da conversa para ser relacionada a um item reutilizado;
- Integração da identificação do usuário autenticado como remetente.

---

## 👨‍👩‍👧‍👦 Desenvolvido por:

- [Natali Schers](https://github.com/natali-schers)
- [Sarah Maranhão](https://github.com/smaranha)
- [Rebeca Soares](https://github.com/Rebeca-Soares)
