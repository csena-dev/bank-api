import type { Request, Response } from 'express';
import { CreateAccountService } from '../../services/account/CreateAccountService';

class CreateAccountController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;
            const { holderName: nomePortador, initialBalance: saldoInicial } = requisicao.body;

            
            if (!nomePortador) {
                resposta.status(400).json({
                    success: false,
                    message: 'Nome do portador é obrigatório'
                });
                return;
            }

            const resultado = await CreateAccountService.execute({
                idUsuario,
                nomePortador,
                saldoInicial: saldoInicial || 0
            });

            if (!resultado.success) {
                resposta.status(400).json({
                    success: false,
                    message: resultado.error
                });
                return;
            }

            resposta.status(201).json({
                success: true,
                message: 'Conta criada com sucesso',
                data: resultado.conta
            });
        } catch (erro) {
            console.error('Erro ao criar conta:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { CreateAccountController };