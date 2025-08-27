import type { Request, Response } from 'express';
import type { CreateUserRequest } from '../../types';
import { UserService } from '../../services/users/UserService';

class CreateUserController {
    async handle(requisicao: Request, resposta: Response): Promise<void> {
        try {
            const { name: nome, email, password: senha }: CreateUserRequest = requisicao.body;

            if (!nome || !email || !senha) {
                resposta.status(400).json({
                    success: false,
                    message: 'Nome, email e senha são obrigatórios'
                });
                return;
            }

            const resultado = await UserService.createUser({ name: nome, email, password: senha });

            if (!resultado.success) {
                resposta.status(400).json({
                    success: false,
                    message: resultado.error === 'User already exists' ? 'Usuário já existe' : 'Erro ao criar usuário'
                });
                return;
            }

            resposta.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: resultado.user
            });
        } catch (erro) {
            console.error('Erro ao criar usuário:', erro);
            resposta.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export { CreateUserController };