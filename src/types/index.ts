// Interfaces existentes...
export interface Account {
    id: string;
    accountNumber: string;
    balance: number;
    holderName: string;
    userId: string;
    createdAt: Date;
}

export interface Transaction {
    id: string;
    fromAccount: string;
    toAccount?: string;
    amount: number;
    type: 'debit' | 'credit' | 'payment' | 'deposit' | 'withdraw';
    description: string;
    timestamp: Date;
}


export interface Debt {
    debtId: string;
    accountNumber: string;
    userId: string;
    amount: number;
    description: string;
    status: 'open' | 'paid';
    createdAt: Date;
    dueDate: Date | undefined;
    paidAt?: Date;
}

export interface CreateDebtRequest {
    accountNumber: string;
    amount: number;
    description: string;
    dueDate?: string; // ISO date string
}

export interface BalanceOperation {
    accountNumber: string;
    amount: number;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface AuthRequest {
    email: string;
    password: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}


