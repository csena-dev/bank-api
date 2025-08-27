import type { Account } from '../../types';
import { MemoryDatabase } from '../../database/memory';

class ListAllAccountsService {
    static async execute(idUsuario: string): Promise<Account[]> {
        const contas = MemoryDatabase.buscarContasPorUsuario(idUsuario);
        return contas.map(conta => ({ ...conta })); // Retornar copias
    }
}

export { ListAllAccountsService };