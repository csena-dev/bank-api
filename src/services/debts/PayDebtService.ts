import type { Transaction, Debt } from '../../types';
import { MemoryDatabase } from '../../database/memory';
import { v4 as uuidv4 } from 'uuid';

interface PayDebtRequest {
    faturaId: string;
    idUsuario: string;
}

class PayDebtService {
    static async execute({
        faturaId,
        idUsuario
    }: PayDebtRequest): Promise<{
        success: boolean;
        dados?: {
            transacao: Transaction;
            fatura: Debt;
            novoSaldo: number;
        };
        error?: string;
    }> {

        try {
            // Buscar fatura
            const fatura = MemoryDatabase.buscarFaturaPorId(faturaId);
            if (!fatura) {

                return { success: false, error: 'Fatura não encontrada' };
            }

           
           if (fatura.userId !== idUsuario) {
                return { success: false, error: 'Fatura não autorizada' };
            }


            if (fatura.status === 'paid') {
                return { success: false, error: 'Fatura já foi paga' };
            }

            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(fatura.accountNumber, idUsuario);
            if (!conta) {
                return { success: false, error: 'Conta não encontrada' };
            }

            
            if (conta.balance < fatura.amount) {
                return { success: false, error: 'Saldo insuficiente' };
            }

            // Debitar valor da conta
            const saldoDebitado = MemoryDatabase.removerSaldo(fatura.accountNumber, fatura.amount);
            if (!saldoDebitado) {
                return { success: false, error: 'Erro ao processar pagamento' };
            }

            // Obter novo saldo
            const contaAtualizada = MemoryDatabase.buscarContaPorNumeroEUsuario(fatura.accountNumber, idUsuario);
            const novoSaldo = contaAtualizada?.balance || 0;


            // Atualizar status da fatura
            const faturaAtualizada = MemoryDatabase.atualizarStatusFatura(faturaId, 'paid');
            if (!faturaAtualizada) {
                return { success: false, error: 'Erro ao atualizar fatura' };
            }

            // Buscar fatura atualizada
            const faturaFinal = MemoryDatabase.buscarFaturaPorId(faturaId)!;

            // Criar transação de pagamento
            const novaTransacao: Transaction = {
                id: uuidv4(),
                fromAccount: fatura.accountNumber,
                amount: fatura.amount,
                type: 'payment',
                description: `Pagamento da fatura: ${fatura.description}`,
                timestamp: new Date()
            };

            // Salvar transação
            MemoryDatabase.adicionarTransacao(novaTransacao);


            return {
                success: true,
                dados: {
                    transacao: novaTransacao,
                    fatura: faturaFinal,
                    novoSaldo
                }
            };

        } catch (erro) {
            console.error('Erro no PayDebtService:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { PayDebtService };