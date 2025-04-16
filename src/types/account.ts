import { STATUS } from ".";

export interface AccountFormInterface {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo: File | null;
}

export interface AccountResponse {
    email: string;
    status: "ACTIVED" | "BLOCKED" | "DISABLED" | "DELETED";
    role: {
        id: number;
        name: string;
    };
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    firstName: string;
    lastName: string;
    phone: string;
    status: string;
    photo: File | null;
}

export interface MessageResponse {
    message: string;
}

export interface IAccount {
    id?: string;
    email: string;
    role?: string;
    firstName: string;
    lastName: string;
    phone: string;
    ip?: string;
    userAgent?: string;
    cover?: string;
    status?: STATUS;
    updatedAt?: Date | string;
    createdAt?: Date | string;
    roleId: number;
}
export interface IAccountRequestBody {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface IChangePassword {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}
