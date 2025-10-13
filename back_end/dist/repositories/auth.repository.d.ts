export declare const authRepository: {
    findByEmail: (email: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        username: string;
        email: string;
        password: string;
        refreshToken: string | null;
    } | null>;
};
