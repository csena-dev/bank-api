import type { Request, Response } from 'express';
import { GetAccountService } from '../../services/account/GetAccountService';

class GetAccountController {
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

            const conta = await GetAccountService.execute(numeroConta, idUsuario);

            if (!conta) {
                resposta.status(404).json({
                    success: false,
                    message: 'Conta não encontrada ou não autorizada'
                });
                return;
            }

            resposta.json({
                success: true,
                data: conta
            });
        } catch (erro) {
            console.error('Erro ao obter conta:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { GetAccountController };