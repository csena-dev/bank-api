import type { Transaction } from '../../types';
import { MemoryDatabase } from '../../database/memory';

class GetTransactionsService {
    static async execute(numeroConta: string, idUsuario: string): Promise<{
        success: boolean;
        transacoes?: Transaction[];
        error?: string;
    }> {
        try {
            // Verificar se conta existe e pertence ao usuário
            const contaExiste = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!contaExiste) {
                return { 
                    success: false, 
                    error: 'Conta não encontrada ou não autorizada' 
                };
            }

            // Buscar transações
            const transacoes = MemoryDatabase.buscarTransacoesPorConta(numeroConta);

            // Ordenar por data (mais recente primeiro)
            const transacoesOrdenadas = transacoes
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(t => ({ ...t })); // Retornar cópias

            return {
                success: true,
                transacoes: transacoesOrdenadas
            };

        } catch (erro) {
            console.error('Erro no serviço de transações:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { GetTransactionsService };