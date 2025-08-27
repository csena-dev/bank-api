import type { Account } from '../../types';
import { MemoryDatabase } from '../../database/memory';

class GetAccountService {
    static async execute(numeroConta: string, idUsuario: string): Promise<Account | null> {
        const conta = MemoryDatabase.buscarContaPorNumeroEUsuario(numeroConta, idUsuario);
        return conta ? { ...conta } : null; // Retornar copia ou null se nao tiver nada
    }
}

export { GetAccountService };