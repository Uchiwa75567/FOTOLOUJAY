export declare const authService: {
    login: (email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    register: (username: string, email: string, password: string, phone?: string, address?: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    refresh: (refreshToken: string) => Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
};
