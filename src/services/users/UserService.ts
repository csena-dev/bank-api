// src/services/UserService.ts
import type { User, CreateUserRequest, AuthRequest } from '../../types';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { MemoryDatabase } from '../../database/memory'; // IMPORTAR O MEMORY DATABASE

export class UserService {

    // Criar novo usuário
    static async createUser({ name: nome, email, password: senha }: CreateUserRequest): Promise<{
        success: boolean;
        user?: Omit<User, 'password'>;
        error?: string;
    }> {
        try {
            // Verificar se usuário já existe usando MemoryDatabase
            const usuarioExistente = MemoryDatabase.buscarUsuarioPorEmail(email);
            if (usuarioExistente) {
                return { success: false, error: 'User already exists' };
            }

            // Hash da senha
            const senhaHasheada = await hash(senha, 8);

            // Criar usuário
            const novoUsuario: User = {
                id: uuidv4(),
                name: nome,
                email,
                password: senhaHasheada,
                createdAt: new Date()
            };

            // Salvar usando MemoryDatabase
            MemoryDatabase.adicionarUsuario(novoUsuario);

            // Retornar usuário sem a senha
            const { password, ...usuarioSemSenha } = novoUsuario;

            return {
                success: true,
                user: usuarioSemSenha
            };

        } catch (erro) {
            console.error('Erro ao criar usuário:', erro);
            return { success: false, error: 'Error creating user' };
        }
    }

    // Autenticar usuário
    static async authenticateUser({ email, password: senha }: AuthRequest): Promise<{
        success: boolean;
        user?: Omit<User, 'password'>;
        token?: string;
        error?: string;
    }> {
        try {
            // Buscar usuário usando MemoryDatabase
            const usuario = MemoryDatabase.buscarUsuarioPorEmail(email);
            if (!usuario) {
                return { success: false, error: 'Invalid credentials' };
            }

            // Verificar senha
            const senhaValida = await compare(senha, usuario.password);
            if (!senhaValida) {
                return { success: false, error: 'Invalid credentials' };
            }

            // Verificar se JWT_SECRET existe
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                console.error('JWT_SECRET não configurado no arquivo .env');
                return { success: false, error: 'Server configuration error' };
            }

            // Gerar token JWT
            const token = sign(
                { sub: usuario.id },
                jwtSecret,
                { expiresIn: '7d' }
            );

            // Retornar usuário sem a senha
            const { password, ...usuarioSemSenha } = usuario;

            return {
                success: true,
                user: usuarioSemSenha,
                token
            };

        } catch (erro) {
            console.error('Erro ao autenticar usuário:', erro);
            return { success: false, error: 'Authentication error' };
        }
    }

    // Buscar usuário por ID
    static async getUserById(idUsuario: string): Promise<Omit<User, 'password'> | null> {
        const usuario = MemoryDatabase.buscarUsuarioPorId(idUsuario);

        if (!usuario) {
            return null;
        }

        // Retornar usuário sem a senha
        const { password, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }

    // Verificar se usuário existe
    static async usuarioExiste(idUsuario: string): Promise<boolean> {
        const usuario = MemoryDatabase.buscarUsuarioPorId(idUsuario);
        return !!usuario; // Converte para boolean
    }
}