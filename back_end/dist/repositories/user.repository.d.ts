import { Role } from "@prisma/client";
export declare const findAll: () => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}[]>;
export declare const findById: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
} | null>;
export declare const create: (data: {
    username: string;
    email: string;
    password: string;
    role?: Role;
}) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
export declare const update: (id: number, data: Partial<{
    username: string;
    email: string;
    password: string;
    role: Role;
}>) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
export declare const remove: (id: number) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: number;
    role: import(".prisma/client").$Enums.Role;
    username: string;
    email: string;
    password: string;
}>;
