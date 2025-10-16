export declare const authRepository: {
    findByEmail: (email: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        username: string;
        email: string;
        password: string;
        refreshToken: string | null;
        phone: string | null;
        address: string | null;
        role: import(".prisma/client").$Enums.Role;
        premiumExpiry: Date | null;
    } | null>;
};
