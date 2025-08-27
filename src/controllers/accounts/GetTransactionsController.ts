import type { Request, Response } from 'express';
import { GetTransactionsService } from '../../services/account/GetTransactionsService';

class GetTransactionsController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const { accountNumber: numeroConta } = requisicao.body;
            const idUsuario = requisicao.user_id!;

            if (!numeroConta) {
                resposta.status(400).json({
                    success: false,
                    message: 'Número da conta é obrigatório'
                });
                return;
            }

            const resultado = await GetTransactionsService.execute(numeroConta, idUsuario);

            if (!resultado.success) {
                resposta.status(404).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.json({
                success: true,
                data: resultado.transacoes,
                total: resultado.transacoes?.length || 0
            });
        } catch (erro) {
            console.error('Erro ao obter transações:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { GetTransactionsController };