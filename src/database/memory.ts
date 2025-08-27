import type { Account, Transaction, User, Debt } from '../types';

class MemoryDatabase {
    private static usuarios: User[] = [];
    private static contas: Account[] = [];
    private static transacoes: Transaction[] = [];
    private static faturas: Debt[] = [];
    private static contadorConta = 1;
    private static contadorFatura = 1;

    // ========== USUÁRIOS (já existem) ==========
    static getUsuarios(): User[] {
        return this.usuarios;
    }

    static adicionarUsuario(usuario: User): void {
        this.usuarios.push(usuario);
    }

    static buscarUsuarioPorEmail(email: string): User | undefined {
        return this.usuarios.find(usuario => usuario.email === email);
    }

    static buscarUsuarioPorId(id: string): User | undefined {
        return this.usuarios.find(usuario => usuario.id === id);
    }

    // ========== CONTAS (já existem) ==========
    static getContas(): Account[] {
        return this.contas;
    }

    static adicionarConta(conta: Account): void {
        this.contas.push(conta);
    }

    static buscarContasPorUsuario(idUsuario: string): Account[] {
        return this.contas.filter(conta => conta.userId === idUsuario);
    }

    static buscarContaPorNumero(numeroConta: string): Account | undefined {
        return this.contas.find(conta => conta.accountNumber === numeroConta);
    }

    static buscarContaPorNumeroEUsuario(numeroConta: string, idUsuario: string): Account | undefined {
        return this.contas.find(
            conta => conta.accountNumber === numeroConta && conta.userId === idUsuario
        );
    }

    // ========== SALDO (NOVO!) ==========
    static adicionarSaldo(numeroConta: string, valor: number): boolean {
        const conta = this.contas.find(conta => conta.accountNumber === numeroConta);
        if (conta) {
            const saldoAnterior = conta.balance;
            conta.balance += valor;
            console.log(`💰 Saldo adicionado: ${numeroConta} | R$ ${saldoAnterior} → R$ ${conta.balance}`);
            return true;
        }
        return false;
    }

    static removerSaldo(numeroConta: string, valor: number): boolean {
        const conta = this.contas.find(conta => conta.accountNumber === numeroConta);
        if (conta && conta.balance >= valor) {
            const saldoAnterior = conta.balance;
            conta.balance -= valor;
            return true;
        }
        return false;
    }

    static atualizarSaldoConta(numeroConta: string, novoSaldo: number): boolean {
        const conta = this.contas.find(conta => conta.accountNumber === numeroConta);
        if (conta) {
            conta.balance = novoSaldo;
            return true;
        }
        return false;
    }

    static gerarNumeroConta(): string {
        const numero = this.contadorConta.toString().padStart(5, '0');
        this.contadorConta++;
        return `${numero}-${Math.floor(Math.random() * 9)}`;
    }

    // ========== FATURAS/DEBTS (NOVO!) ==========
    static getFaturas(): Debt[] {
        return this.faturas;
    }

    static adicionarFatura(fatura: Debt): void {
        this.faturas.push(fatura);
    }

    static buscarFaturasPorConta(numeroConta: string): Debt[] {
        return this.faturas.filter(fatura => fatura.accountNumber === numeroConta);
    }

    static buscarFaturaPorId(faturaId: string): Debt | undefined {
        return this.faturas.find(fatura => fatura.debtId === faturaId);
    }

    static atualizarStatusFatura(faturaId: string, novoStatus: 'open' | 'paid'): boolean {
        const fatura = this.faturas.find(fatura => fatura.debtId === faturaId);
        if (fatura) {
            const statusAnterior = fatura.status;
            fatura.status = novoStatus;
            if (novoStatus === 'paid') {
                fatura.paidAt = new Date();
            }
            console.log(`📋 Status fatura atualizado: ${faturaId} | ${statusAnterior} → ${novoStatus}`);
            return true;
        }
        return false;
    }

    static gerarIdFatura(): string {
        const numero = this.contadorFatura.toString().padStart(8, '0');
        this.contadorFatura++;
        return `DEBT-${numero}`;
    }

    // ========== TRANSAÇÕES (já existem) ==========
    static getTransacoes(): Transaction[] {
        return this.transacoes;
    }

    static adicionarTransacao(transacao: Transaction): void {
        this.transacoes.push(transacao);
    }

    static buscarTransacoesPorConta(numeroConta: string): Transaction[] {
        return this.transacoes.filter(
            transacao => transacao.fromAccount === numeroConta || transacao.toAccount === numeroConta
        );
    }

    static limparDados(): void {
        this.usuarios = [];
        this.contas = [];
        this.transacoes = [];
        this.faturas = [];
        this.contadorConta = 1;
        this.contadorFatura = 1;
        console.log('🗑️ Todos os dados limpos da memória');
    }
}

export { MemoryDatabase };