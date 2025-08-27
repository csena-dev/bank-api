import type { Request, Response } from 'express';
import { PayDebtService } from '../../services/debts/PayDebtService';

class PayDebtController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;
            const { debtId: faturaId } = requisicao.body;

            console.log('\n🚀 PayDebtController.handle() iniciado');
            console.log(`   Usuário: ${idUsuario}`);
            console.log(`   Fatura ID: ${faturaId}`);

            if (!faturaId) {
                resposta.status(400).json({
                    success: false,
                    message: 'ID da fatura é obrigatório'
                });
                return;
            }

            const resultado = await PayDebtService.execute({
                faturaId,
                idUsuario
            });

            if (!resultado.success) {
                const status = resultado.error?.includes('não encontrada') ? 404 :
                             resultado.error?.includes('não autorizada') ? 403 :
                             resultado.error?.includes('já foi paga') ? 409 :
                             resultado.error?.includes('insuficiente') ? 400 : 400;
                
                resposta.status(status).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.json({
                success: true,
                message: 'Fatura paga com sucesso',
                data: resultado.dados
            });
        } catch (erro) {
            console.error('Erro no PayDebtController:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { PayDebtController };