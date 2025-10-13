export interface PayTechConfig {
    apiKey: string;
    secretKey: string;
    baseUrl: string;
}
export interface PaymentRequest {
    item_name: string;
    item_price: number;
    currency: string;
    ref_command: string;
    command_name: string;
    env: 'test' | 'prod';
    ipn_url: string;
    success_url: string;
    cancel_url: string;
    custom_field?: string;
}
export interface PaymentResponse {
    success: number;
    redirect_url?: string;
    token?: string;
    error?: string;
}
export declare class PayTechService {
    private config;
    constructor();
    createPayment(paymentData: PaymentRequest): Promise<PaymentResponse>;
    verifyPayment(token: string): Promise<any>;
}
export declare const payTechService: PayTechService;
