import type { Debt } from '../../types';
import { MemoryDatabase } from '../../database/memory';

class GetDebtsService {
    static async execute(numeroConta: string, idUsuario: string): Promise<{
        success: boolean;
        faturas?: Debt[];
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


            // Buscar faturas da conta
            const faturas = MemoryDatabase.buscarFaturasPorConta(numeroConta);
            

            // Ordenar por data de criação (mais recente primeiro)
            const faturasOrdenadas = faturas
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(fatura => ({ ...fatura })); // Retornar cópias

            
            return {
                success: true,
                faturas: faturasOrdenadas
            };

        } catch (erro) {
            console.error('💥 Erro no GetDebtsService:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { GetDebtsService };