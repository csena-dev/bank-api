import type { Request, Response } from 'express';
import { ListAllAccountsService } from '../../services/account/ListAllAccountsService';

class ListAllAccountsController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;
            const contas = await ListAllAccountsService.execute(idUsuario);

            resposta.json({
                success: true,
                data: contas,
                total: contas.length
            });
        } catch (erro) {
            console.error('Erro ao listar contas:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { ListAllAccountsController };