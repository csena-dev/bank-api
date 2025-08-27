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
        console.log('\n💰 AddBalanceService.execute() iniciado');
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

            // Adicionar saldo
            const saldoAdicionado = MemoryDatabase.adicionarSaldo(numeroConta, valor);
            if (!saldoAdicionado) {
                console.log('❌ Erro ao adicionar saldo');
                return { success: false, error: 'Erro ao adicionar saldo' };
            }

            // Obter novo saldo
            const contaAtualizada = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
            const novoSaldo = contaAtualizada?.balance || 0;

            console.log(`✅ Saldo atualizado: R$ ${conta.balance} → R$ ${novoSaldo}`);

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

            console.log('✅ AddBalanceService concluído com sucesso');

            return {
                success: true,
                dados: {
                    transacao: novaTransacao,
                    novoSaldo
                }
            };

        } catch (erro) {
            console.error('💥 Erro no AddBalanceService:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { AddBalanceService };