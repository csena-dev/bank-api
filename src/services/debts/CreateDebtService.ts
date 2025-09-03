import type { Debt } from '../../types';
import { MemoryDatabase } from '../../database/memory';

interface CreateDebtRequest {
    numeroConta: string;
    idUsuario: string;
    valor: number;
    descricao: string;
    dataVencimento?: string;
}

class CreateDebtService {
    static async execute({
        numeroConta,
        idUsuario,
        valor,
        descricao,
        dataVencimento
    }: CreateDebtRequest): Promise<{
        success: boolean;
        fatura?: Debt;
        error?: string;
    }> {

        try {
            // Verificar se conta existe e pertence ao usuário
            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!conta) {
    
                return { success: false, error: 'Conta não encontrada' };
            }

            // Gerar ID da fatura
            const faturaId = MemoryDatabase.gerarIdFatura();
        

            // Processar data de vencimento
            let dueDate: Date | undefined;
            if (dataVencimento) {
                dueDate = new Date(dataVencimento);
                if (isNaN(dueDate.getTime())) {
                    
                    return { success: false, error: 'Data de vencimento inválida' };
                }
            }

            // Criar fatura
            const novaFatura: Debt = {
                debtId: faturaId,
                accountNumber: numeroConta,
                userId: idUsuario,
                amount: valor,
                description: descricao,
                status: 'open',
                createdAt: new Date(),
                dueDate
            };


            // Salvar no banco em memória
            MemoryDatabase.adicionarFatura(novaFatura);

            return {
                success: true,
                fatura: novaFatura
            };

        } catch (erro) {
            console.error('Erro no CreateDebtService:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { CreateDebtService };