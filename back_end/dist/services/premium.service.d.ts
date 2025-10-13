export interface PremiumPack {
    id: string;
    name: string;
    price: number;
    duration: number;
    unit: string;
}
export declare const initiatePremiumPayment: (userId: number, packId: string) => Promise<{
    success: boolean;
    paymentUrl: string | undefined;
    token: string;
    refCommand: string;
    pack: PremiumPack;
}>;
export declare const processPremiumPayment: (token: string) => Promise<{
    success: boolean;
    message: string;
    pack: PremiumPack;
    premiumExpiry: Date;
    daysRemaining: number;
}>;
export declare const getPremiumStatus: (userId: number) => Promise<{
    isPremium: boolean | null;
    premiumExpiry: Date | null;
    daysRemaining: number;
}>;
export declare const checkPremiumStatus: (userId: number) => Promise<boolean>;
