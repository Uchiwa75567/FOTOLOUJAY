export declare const authService: {
    login: (email: string, password: string) => Promise<{
        token: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            username: string;
            email: string;
            password: string;
        };
    }>;
    register: (username: string, email: string, password: string) => Promise<{
        token: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            username: string;
            email: string;
            password: string;
        };
    }>;
};
