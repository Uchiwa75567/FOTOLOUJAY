export declare const authService: {
    login: (email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    register: (username: string, email: string, password: string, phone?: string, address?: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    refresh: (refreshToken: string) => Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
};
