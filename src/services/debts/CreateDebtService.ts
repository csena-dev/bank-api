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
        console.log('\n📄 CreateDebtService.execute() iniciado');
        console.log(`   Conta: ${numeroConta}`);
        console.log(`   Usuário: ${idUsuario}`);
        console.log(`   Valor: R$ ${valor}`);
        console.log(`   Descrição: ${descricao}`);

        try {
            // Verificar se conta existe e pertence ao usuário
            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!conta) {
                console.log('❌ Conta não encontrada');
                return { success: false, error: 'Conta não encontrada' };
            }

            console.log(`✅ Conta encontrada: ${conta.accountNumber} (${conta.holderName})`);

            // Gerar ID da fatura
            const faturaId = MemoryDatabase.gerarIdFatura();
            console.log(`🆔 ID da fatura gerado: ${faturaId}`);

            // Processar data de vencimento
            let dueDate: Date | undefined;
            if (dataVencimento) {
                dueDate = new Date(dataVencimento);
                if (isNaN(dueDate.getTime())) {
                    console.log('❌ Data de vencimento inválida');
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

            console.log('📝 Fatura criada (objeto):', {
                debtId: novaFatura.debtId,
                accountNumber: novaFatura.accountNumber,
                amount: novaFatura.amount,
                description: novaFatura.description,
                status: novaFatura.status,
                dueDate: novaFatura.dueDate?.toISOString()
            });

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