import type { Request, Response } from 'express';
import { RemoveBalanceService } from '../../services/balance/RemoveBalanceService';

class RemoveBalanceController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;
            const { accountNumber: numeroConta, amount: valor, description: descricao } = requisicao.body;

            if (!numeroConta || !valor) {
                resposta.status(400).json({
                    success: false,
                    message: 'Número da conta e valor são obrigatórios'
                });
                return;
            }

            if (valor <= 0) {
                resposta.status(400).json({
                    success: false,
                    message: 'Valor deve ser maior que zero'
                });
                return;
            }

            const resultado = await RemoveBalanceService.execute({
                numeroConta,
                idUsuario,
                valor,
                descricao: descricao || 'Saque em conta'
            });

            if (!resultado.success) {
                const status = resultado.error?.includes('não encontrada') ? 404 : 
                             resultado.error?.includes('insuficiente') ? 400 : 400;
                resposta.status(status).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.json({
                success: true,
                message: 'Saldo removido com sucesso',
                data: resultado.dados
            });
        } catch (erro) {
            console.error('Erro ao remover saldo:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { RemoveBalanceController };