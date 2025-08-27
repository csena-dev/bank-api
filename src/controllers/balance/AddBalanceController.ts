import type { Request, Response } from 'express';
import { AddBalanceService } from '../../services/balance/AddBalanceService';

class AddBalanceController {
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

            const resultado = await AddBalanceService.execute({
                numeroConta,
                idUsuario,
                valor,
                descricao: descricao || 'Depósito em conta'
            });

            if (!resultado.success) {
                const status = resultado.error?.includes('não encontrada') ? 404 : 400;
                resposta.status(status).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.json({
                success: true,
                message: 'Saldo adicionado com sucesso',
                data: resultado.dados
            });
        } catch (erro) {
            console.error('Erro ao adicionar saldo:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { AddBalanceController };