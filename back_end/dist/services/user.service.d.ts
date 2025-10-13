export declare const getAllUsers: () => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
}[]>;
export declare const getUserById: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
} | null>;
export declare const createUser: (data: any) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
}>;
export declare const updateUser: (id: number, data: any) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
}>;
export declare const deleteUser: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
}>;
