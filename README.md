# APIs - Bank-Api


API bancária desenvolvida em Node.js com TypeScript, utilizando Express.  Permite gerenciar usuários, contas, saldo e dívidas.

## ⚡ Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- JWT para autenticação
- Swagger para documentação das APIs
- bcryptjs para hash de senhas
- dotenv para variáveis de ambiente

## 🔹 Instalação e execução

**1. Clone o projeto:**

git clone https://github.com/csena-dev/bank-api.git

cd bank-api

**2. Instale as dependências:** 

yarn install

**3. Criar um arquivo .env na raiz do projeto e colar as variaveis abaixo:**

PORT=3001

NODE_ENV=development

JWT_SECRET=45fa2db0732f0160aee743e1cda3be21

**4. Execute em modo desenvolvimento:**

yarn dev


**5. Pronto! Agora só confirmar se o projeto esta rodando:**

Irá exibir no terminal/cmd:

*Servidor rodando na url http://localhost:3001 :)*


## 🔹 Documentação Swagger

**1. Depois de rodar o projeto estará disponivel a documentacão no Swagger:**

A documentação das rotas está disponível no Swagger UI (/api-docs) e inclui todas as rotas de usuários, contas, saldo e dívidas.

http://localhost:3001/api-docs/

**2. Disponivel todas as chamadas na pasta "Postman"**

Na raiz do projeto tem pasta Postman com o json de todas as chamadas

## 🛠 Estrutura do projeto

```text
src/
├── controllers/    # Lógica das rotas
├── middleware/     # Middlewares (ex: autenticação)
├── routes/         # Rotas da API
├── services/       # Serviços com regras de negócio
├── types/          # Tipagens TypeScript
└── server.ts       # Arquivo principal do servidor

```

## 🛠 Rotas das APIs

```text

-> Usuários
- POST /api/users/register – Criar usuário
- POST /api/users/login – Autenticar usuário
- GET /api/users/me – Obter detalhes do usuário (protegida)

-> Contas
- GET /api/accounts** – Listar todas as contas (protegida)
- POST /api/accounts/create – Criar nova conta (protegida)
- POST /api/accounts/get – Obter conta específica (protegida)
- POST /api/accounts/transactions – Histórico de transações (protegida)

-> Saldo
- POST /api/balance/add – Adicionar saldo (protegida)
- POST /api/balance/remove – Remover saldo (protegida)

-> Dívidas
- POST /api/debts/create – Criar fatura (protegida)
- POST /api/debts/get – Consultar faturas (protegida)
- POST /api/debts/pay – Pagar fatura (protegida)

```



