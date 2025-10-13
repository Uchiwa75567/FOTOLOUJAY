export declare const authService: {
    login: (email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            username: string;
            email: string;
            password: string;
            refreshToken: string | null;
        };
    }>;
    register: (username: string, email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            username: string;
            email: string;
            password: string;
            refreshToken: string | null;
        };
    }>;
    refresh: (refreshToken: string) => Promise<{
        accessToken: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            username: string;
            email: string;
            password: string;
            refreshToken: string | null;
        };
    }>;
};
