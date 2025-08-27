// src/services/accounts/CreateAccountService.ts
import type { Account } from '../../types';
import { MemoryDatabase } from '../../database/memory';
import { v4 as uuidv4 } from 'uuid';

interface CreateAccountRequest {
    idUsuario: string;
    nomePortador: string;
    saldoInicial: number;
}

class CreateAccountService {
    static async execute({ 
        idUsuario, 
        nomePortador, 
        saldoInicial 
    }: CreateAccountRequest): Promise<{
        success: boolean;
        conta?: Account;
        error?: string;
    }> {
        try {
            
            // Verificar se usuário existe
            const usuario = MemoryDatabase.buscarUsuarioPorId(idUsuario);
            if (!usuario) {
                return { success: false, error: 'Usuário não encontrado' };
            }

            // Gerar numero da conta
            const numeroConta = MemoryDatabase.gerarNumeroConta();

            // Criar conta
            const novaConta: Account = {
                id: uuidv4(),
                accountNumber: numeroConta,
                balance: saldoInicial,
                holderName: nomePortador,
                userId: idUsuario,
                createdAt: new Date()
            };


            // Salvar no banco em memória
            MemoryDatabase.adicionarConta(novaConta);

            return {
                success: true,
                conta: novaConta
            };

        } catch (erro) {
            console.error('Erro no serviço de criar conta:', erro);
            return { success: false, error: 'Erro interno do serviço' };
        }
    }
}

export { CreateAccountService };