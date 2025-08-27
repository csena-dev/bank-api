import type { Request, Response } from 'express';
import { UserService } from '../../services/users/UserService';

class DetailUserController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const idUsuario = requisicao.user_id!;

            const usuario = await UserService.getUserById(idUsuario);

            if (!usuario) {
                resposta.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            resposta.json({
                success: true,
                data: usuario
            });
        } catch (erro) {
            console.error('Erro ao obter detalhes do usuário:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { DetailUserController };