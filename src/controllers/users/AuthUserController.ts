import type { Request, Response } from 'express';
import type { AuthRequest } from '../../types';
import { UserService } from '../../services/users/UserService';

class AuthUserController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const { email, password: senha }: AuthRequest = requisicao.body;

            if (!email || !senha) {
                resposta.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios'
                });
                return;
            }

            const resultado = await UserService.authenticateUser({ email, password: senha });

            if (!resultado.success) {
                resposta.status(401).json({
                    success: false,
                    message: resultado.error === 'Invalid credentials' ? 'Credenciais inválidas' : 'Erro na autenticação'
                });
                return;
            }

            resposta.json({
                success: true,
                message: 'Autenticação realizada com sucesso',
                data: {
                    user: resultado.user,
                    token: resultado.token
                }
            });
        } catch (erro) {
            console.error('Erro ao autenticar usuário:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { AuthUserController };