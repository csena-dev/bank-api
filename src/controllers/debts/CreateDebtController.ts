import type { Request, Response } from 'express';
import { CreateDebtService } from '../../services/debts/CreateDebtService';

class CreateDebtController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;
            const { 
                accountNumber: numeroConta, 
                amount: valor, 
                description: descricao,
                dueDate: dataVencimento
            } = requisicao.body;

            if (!numeroConta || !valor || !descricao) {
                resposta.status(400).json({
                    success: false,
                    message: 'Número da conta, valor e descrição são obrigatórios'
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

            const resultado = await CreateDebtService.execute({
                numeroConta,
                idUsuario,
                valor,
                descricao,
                dataVencimento
            });

            if (!resultado.success) {
                const status = resultado.error?.includes('não encontrada') ? 404 : 400;
                resposta.status(status).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.status(201).json({
                success: true,
                message: 'Fatura criada com sucesso',
                data: resultado.fatura
            });
        } catch (erro) {
            console.error('Erro ao criar fatura:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { CreateDebtController };