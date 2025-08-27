// src/middlewares/isAuthenticated.ts
import type { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

// Extender o tipo Request para incluir user_id
declare global {
    namespace Express {
        interface Request {
            user_id?: string;
        }
    }
}

export function isAuthenticated(
    requisicao: Request,
    resposta: Response,
    proximo: NextFunction
): void {
    const tokenAutorizacao = requisicao.headers.authorization;

    if (!tokenAutorizacao) {
        resposta.status(401).json({
            success: false,
            message: 'Token de acesso obrigatório'
        });
        return;
    }

    const [, token] = tokenAutorizacao.split(" ");

    // Verificar se o token existe após o split
    if (!token) {
        resposta.status(401).json({
            success: false,
            message: 'Token inválido'
        });
        return;
    }

    try {
        const { sub } = verify(
            token,
            process.env.JWT_SECRET as string
        ) as Payload;

        requisicao.user_id = sub;

        return proximo(); //ok esta autenticado

    } catch (erro) {
        resposta.status(401).json({
            success: false,
            message: 'Token inválido'
        });
        return;
    }
}