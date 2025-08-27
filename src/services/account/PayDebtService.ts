import type { Transaction } from '../../types';
import { MemoryDatabase } from '../../database/memory';
import { v4 as uuidv4 } from 'uuid';

interface PayDebtRequest {
    numeroConta: string;
    idUsuario: string;
    valor: number;
    idDivida: string;
    descricao?: string;
}

class PayDebtService {
    static async execute({
        numeroConta,
        idUsuario,
        valor,
        idDivida,
        descricao
    }: PayDebtRequest): Promise<{
        success: boolean;
        dados?: {
            transacao: Transaction;
            novoSaldo: number;
            idDivida: string;
        };
        error?: string;
    }> {
        try {
            // Verificar se conta existe e pertence ao usuário
            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!conta) {
                return { success: false, error: 'Conta não encontrada' };
            }

            // Verificar saldo suficiente
            if (conta.balance < valor) {
                return { success: false, error: 'Saldo insuficiente' };
            }

            // Calcular novo saldo
            const novoSaldo = conta.balance - valor;

            // Atualizar saldo
            const saldoAtualizado = MemoryDatabase.atualizarSaldoConta(numeroConta, novoSaldo);
            if (!saldoAtualizado) {
                return { success: false, error: 'Erro ao atualizar saldo' };
            }

            // Criar transação
            const novaTransacao: Transaction = {
                id: uuidv4(),
                fromAccount: numeroConta,
                amount: valor,
                type: 'payment',
                description: descricao || `Pagamento de dívida: ${idDivida}`,
                timestamp: new Date()
            };

            // Salvar transação
            MemoryDatabase.adicionarTransacao(novaTransacao);

            return {
                success: true,
                dados: {
                    transacao: novaTransacao,
                    novoSaldo,
                    idDivida
                }
            };

        } catch (erro) {
            console.error('Erro no serviço de pagamento:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { PayDebtService };