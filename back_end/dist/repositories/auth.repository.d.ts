export declare const authRepository: {
    findByEmail: (email: string) => Promise<{
        phone: string | null;
        address: string | null;
        id: number;
        username: string;
        email: string;
        password: string;
        refreshToken: string | null;
        role: import(".prisma/client").$Enums.Role;
        premiumExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
};
