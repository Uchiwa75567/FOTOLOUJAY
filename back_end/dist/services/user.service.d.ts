export declare const getAllUsers: () => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}[]>;
export declare const getUserById: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
} | null>;
export declare const createUser: (data: any) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
export declare const updateUser: (id: number, data: any) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
export declare const deleteUser: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
