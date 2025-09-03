import type { Transaction } from '../../types';
import { MemoryDatabase } from '../../database/memory';
import { v4 as uuidv4 } from 'uuid';

interface AddBalanceRequest {
    numeroConta: string;
    idUsuario: string;
    valor: number;
    descricao: string;
}

class AddBalanceService {
    static async execute({
        numeroConta,
        idUsuario,
        valor,
        descricao
    }: AddBalanceRequest): Promise<{
        success: boolean;
        dados?: {
            transacao: Transaction;
            novoSaldo: number;
        };
        error?: string;
    }> {

        try {
            // Verificar se conta existe e pertence ao usuário
            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!conta) {
                
                return { success: false, error: 'Conta não encontrada' };
            }


            // Adicionar saldo
            const saldoAdicionado = MemoryDatabase.adicionarSaldo(numeroConta, valor);
            if (!saldoAdicionado) {
                
                return { success: false, error: 'Erro ao adicionar saldo' };
            }

            // Obter novo saldo
            const contaAtualizada = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            const novoSaldo = contaAtualizada?.balance || 0;


            // Criar transação de depósito
            const novaTransacao: Transaction = {
                id: uuidv4(),
                fromAccount: numeroConta,
                amount: valor,
                type: 'deposit',
                description: descricao,
                timestamp: new Date()
            };

            // Salvar transação
            MemoryDatabase.adicionarTransacao(novaTransacao);


            return {
                success: true,
                dados: {
                    transacao: novaTransacao,
                    novoSaldo
                }
            };

        } catch (erro) {
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { AddBalanceService };