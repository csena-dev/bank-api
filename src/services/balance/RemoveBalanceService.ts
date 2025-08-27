import type { Transaction } from '../../types';
import { MemoryDatabase } from '../../database/memory';
import { v4 as uuidv4 } from 'uuid';

interface RemoveBalanceRequest {
    numeroConta: string;
    idUsuario: string;
    valor: number;
    descricao: string;
}

class RemoveBalanceService {
    static async execute({
        numeroConta,
        idUsuario,
        valor,
        descricao
    }: RemoveBalanceRequest): Promise<{
        success: boolean;
        dados?: {
            transacao: Transaction;
            novoSaldo: number;
        };
        error?: string;
    }> {
        console.log('RemoveBalanceService.execute() iniciado');
        console.log(`   Conta: ${numeroConta}`);
        console.log(`   Usuário: ${idUsuario}`);
        console.log(`   Valor: R$ ${valor}`);

        try {
            // Verificar se conta existe e pertence ao usuário
            const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            if (!conta) {
                console.log('❌ Conta não encontrada');
                return { success: false, error: 'Conta não encontrada' };
            }

            console.log(`✅ Conta encontrada - Saldo atual: R$ ${conta.balance}`);

            // Verificar saldo suficiente
            if (conta.balance < valor) {
                console.log(`❌ Saldo insuficiente: R$ ${conta.balance} < R$ ${valor}`);
                return { success: false, error: 'Saldo insuficiente' };
            }

            // Remover saldo
            const saldoRemovido = MemoryDatabase.removerSaldo(numeroConta, valor);
            if (!saldoRemovido) {
                console.log('❌ Erro ao remover saldo');
                return { success: false, error: 'Erro ao remover saldo' };
            }

            // Obter novo saldo
            const contaAtualizada = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            const novoSaldo = contaAtualizada?.balance || 0;

            console.log(`✅ Saldo atualizado: R$ ${conta.balance} → R$ ${novoSaldo}`);

            // Criar transação de saque
            const novaTransacao: Transaction = {
                id: uuidv4(),
                fromAccount: numeroConta,
                amount: valor,
                type: 'withdraw',
                description: descricao,
                timestamp: new Date()
            };

            // Salvar transação
            MemoryDatabase.adicionarTransacao(novaTransacao);

            console.log('✅ RemoveBalanceService concluído com sucesso');

            return {
                success: true,
                dados: {
                    transacao: novaTransacao,
                    novoSaldo
                }
            };

        } catch (erro) {
            console.error('Erro no RemoveBalanceService:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { RemoveBalanceService };