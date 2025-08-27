import { Router } from 'express';

// Controllers de usuários
import { CreateUserController } from '../controllers/users/CreateUserController';
import { AuthUserController } from '../controllers/users/AuthUserController';
import { DetailUserController } from '../controllers/users/DetailUserController';

// Controllers de contas
import { CreateAccountController } from '../controllers/accounts/CreateAccountController';
import { ListAllAccountsController } from '../controllers/accounts/ListAllAccountController';
import { GetAccountController } from '../controllers/accounts/GetAccountController';
import { GetTransactionsController } from '../controllers/accounts/GetTransactionsController';


// Controllers de saldo
import { AddBalanceController } from '../controllers/balance/AddBalanceController';
import { RemoveBalanceController } from '../controllers/balance/RemoveBalanceController';

// Controllers de dividas
import { CreateDebtController } from '../controllers/debts/CreateDebtController';
import { GetDebtsController } from '../controllers/debts/GetDebtsController';
import { PayDebtController } from '../controllers/debts/PayDebtController';


// Middleware
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = Router();


// ========== ROTAS DE USUARIOS ==========

router.post('/users/register', new CreateUserController().handle);
router.post('/users/login', new AuthUserController().handle);

// Rotas protegidas de usuarios
router.get('/users/me', isAuthenticated, new DetailUserController().handle);

// ========== ROTAS DE CONTAS ==========
// Todas as rotas de contas sao protegidas

router.get('/accounts', isAuthenticated, new ListAllAccountsController().handle); //obter todas as contas
router.post('/accounts/create', isAuthenticated, new CreateAccountController().handle); //criar nova conta
router.post('/accounts/get', isAuthenticated, new GetAccountController().handle); //obter conta especifica
router.post('/accounts/transactions', isAuthenticated, new GetTransactionsController().handle); //obter historico de transacao

// ========== ROTAS DE SALDO ==========
router.post('/balance/add', isAuthenticated, new AddBalanceController().handle); //adicionar saldo na conta
router.post('/balance/remove', isAuthenticated, new RemoveBalanceController().handle); //remover saldo na conta

// ========== ROTAS DE DÍVIDAS ==========
router.post('/debts/create', isAuthenticated, new CreateDebtController().handle); //criar uma fatura/divida
router.post('/debts/get', isAuthenticated, new GetDebtsController().handle); //consultar uma fatura/divida
router.post('/debts/pay', isAuthenticated, new PayDebtController().handle); //pagar uma fatura/divida


// ========== DOCUMENTACAO DO PROJETO SWAGGER =============

//Para visualizar a documentacao apenas colar o seguinte link na web >  http://localhost:3001/api-docs

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas de gerenciamento de usuários
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       description: Informações do usuário a ser criado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Caio Sena"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "caio@email.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "Caio Sena"
 *                     email:
 *                       type: string
 *                       example: "caio@email.com"
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nome, email e senha são obrigatórios"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       description: Credenciais do usuário
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "caio@email.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Autenticação realizada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "12345"
 *                         name:
 *                           type: string
 *                           example: "Caio Sena"
 *                         email:
 *                           type: string
 *                           example: "caio@email.com"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email ou senha ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email e senha são obrigatórios"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Credenciais inválidas"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obter detalhes do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "Caio Sena"
 *                     email:
 *                       type: string
 *                       example: "caio@email.com"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


// ========== DOCUMENTACAO CONTA/ACCOUNT =============

/**
 * @swagger
 * tags:
 *   name: Contas
 *   description: Rotas de gerenciamento de contas
 */

/**
 * @swagger
 * /api/accounts/create:
 *   post:
 *     summary: Criar nova conta bancária
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados da nova conta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               holderName:
 *                 type: string
 *                 example: "Caio Sena"
 *               initialBalance:
 *                 type: number
 *                 example: 1000
 *             required:
 *               - holderName
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Conta criada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "00002-1"
 *                     holderName:
 *                       type: string
 *                       example: "Caio Sena"
 *                     balance:
 *                       type: number
 *                       example: 1000
 *                     userId:
 *                       type: string
 *                       example: "12345"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nome do portador é obrigatório"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


/**
 * @swagger
 * /api/accounts/get:
 *   post:
 *     summary: Obter detalhes de uma conta específica
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Número da conta a ser consultada
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *             required:
 *               - accountNumber
 *     responses:
 *       200:
 *         description: Conta retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "00002-1"
 *                     holderName:
 *                       type: string
 *                       example: "Caio Sena"
 *                     balance:
 *                       type: number
 *                       example: 1500
 *                     userId:
 *                       type: string
 *                       example: "12345"
 *       400:
 *         description: Número da conta não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Número da conta é obrigatório"
 *       404:
 *         description: Conta não encontrada ou não autorizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta não encontrada ou não autorizada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Listar todas as contas do usuário logado
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "00002-1"
 *                       holderName:
 *                         type: string
 *                         example: "Caio Sena"
 *                       balance:
 *                         type: number
 *                         example: 1500
 *                       userId:
 *                         type: string
 *                         example: "12345"
 *                 total:
 *                   type: number
 *                   example: 2
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


/**
 * @swagger
 * /api/accounts/transactions:
 *   post:
 *     summary: Obter histórico de transações de uma conta
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Número da conta para consultar as transações
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *             required:
 *               - accountNumber
 *     responses:
 *       200:
 *         description: Transações retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "txn_98765"
 *                       accountNumber:
 *                         type: string
 *                         example: "00002-1"
 *                       type:
 *                         type: string
 *                         example: "credit"
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       description:
 *                         type: string
 *                         example: "Depósito inicial"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-27T18:00:00.000Z"
 *                 total:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Número da conta não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Número da conta é obrigatório"
 *       404:
 *         description: Conta não encontrada ou erro no histórico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta não encontrada ou não autorizada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */



// ========== DOCUMENTACAO SALDO/BALANCE =============

/**
 * @swagger
 * tags:
 *   name: Saldo
 *   description: Rotas de gerenciamento de saldo
 */


/**
 * @swagger
 * /api/balance/add:
 *   post:
 *     summary: Adicionar saldo a uma conta
 *     tags: [Saldo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Informações para adicionar saldo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *               amount:
 *                 type: number
 *                 example: 500
 *               description:
 *                 type: string
 *                 example: "Depósito em conta"
 *             required:
 *               - accountNumber
 *               - amount
 *     responses:
 *       200:
 *         description: Saldo adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Saldo adicionado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountNumber:
 *                       type: string
 *                       example: "00002-1"
 *                     balance:
 *                       type: number
 *                       example: 1500
 *       400:
 *         description: Erro de validação (campo obrigatório ou valor inválido)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Número da conta e valor são obrigatórios"
 *       404:
 *         description: Conta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta não encontrada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


/**
 * @swagger
 * /api/balance/remove:
 *   post:
 *     summary: Remover saldo de uma conta
 *     tags: [Saldo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Informações para remover saldo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *               amount:
 *                 type: number
 *                 example: 200
 *               description:
 *                 type: string
 *                 example: "Saque em conta"
 *             required:
 *               - accountNumber
 *               - amount
 *     responses:
 *       200:
 *         description: Saldo removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Saldo removido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountNumber:
 *                       type: string
 *                       example: "00002-1"
 *                     balance:
 *                       type: number
 *                       example: 1300
 *       400:
 *         description: Erro de validação ou saldo insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Saldo insuficiente"
 *               examples:
 *                 valor_invalido:
 *                   summary: Valor menor ou igual a zero
 *                   value:
 *                     success: false
 *                     message: "Valor deve ser maior que zero"
 *                 saldo_insuficiente:
 *                   summary: Saldo insuficiente
 *                   value:
 *                     success: false
 *                     message: "Saldo insuficiente"
 *       404:
 *         description: Conta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta não encontrada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */


// ========== DOCUMENTACAO DIVIDAS/DEBTS =============

/**
 * @swagger
 * tags:
 *   name: Dívidas
 *   description: Rotas de gerenciamento de dívidas
 */

/**
 * @swagger
 * /api/debts/create:
 *   post:
 *     summary: Criar uma nova fatura/dívida
 *     tags: [Dívidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Informações da fatura a ser criada
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *               amount:
 *                 type: number
 *                 example: 500
 *               description:
 *                 type: string
 *                 example: "Fatura cartão de crédito"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-30"
 *             required:
 *               - accountNumber
 *               - amount
 *               - description
 *     responses:
 *       201:
 *         description: Fatura criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Fatura criada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "debt_12345"
 *                     accountNumber:
 *                       type: string
 *                       example: "00002-1"
 *                     amount:
 *                       type: number
 *                       example: 500
 *                     description:
 *                       type: string
 *                       example: "Fatura cartão de crédito"
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-09-30"
 *       400:
 *         description: Dados inválidos ou erro de validação
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Erro interno do servidor
 */




/**
 * @swagger
 * /api/debts/get:
 *   post:
 *     summary: Consultar faturas/dívidas de uma conta
 *     tags: [Dívidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Informações para consultar dívidas
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "00002-1"
 *     responses:
 *       200:
 *         description: Faturas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "debt_001"
 *                       accountNumber:
 *                         type: string
 *                         example: "00002-1"
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       description:
 *                         type: string
 *                         example: "Fatura cartão de crédito"
 *                       dueDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-09-30"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                 total:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Número da conta não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Número da conta é obrigatório"
 *       404:
 *         description: Conta não encontrada ou sem faturas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta não encontrada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */





/**
 * @swagger
 * /api/debts/pay:
 *   post:
 *     summary: Pagar uma fatura/dívida
 *     tags: [Dívidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - debtId
 *             properties:
 *               debtId:
 *                 type: string
 *                 example: "debt_001"
 *     responses:
 *       200:
 *         description: Fatura paga com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Fatura paga com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "debt_001"
 *                     accountNumber:
 *                       type: string
 *                       example: "00002-1"
 *                     amount:
 *                       type: number
 *                       example: 500
 *                     status:
 *                       type: string
 *                       example: "paid"
 *                     paidAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-27T15:30:00Z"
 *       400:
 *         description: Erro de validação ou saldo insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Saldo insuficiente"
 *       403:
 *         description: Usuário não autorizado para pagar a fatura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Fatura não autorizada"
 *       404:
 *         description: Fatura não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Fatura não encontrada"
 *       409:
 *         description: Fatura já foi paga
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Fatura já foi paga"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */



export { router };