import { PaymentRequest, PaymentResponse } from './paytech.service';
export interface MockVerificationResponse {
    success: number;
    status?: string;
    amount?: string;
    currency?: string;
    payment_date?: string;
    custom_field?: string;
    error?: string;
}
export declare class MockPayTechService {
    private baseUrl;
    createPayment(request: PaymentRequest): Promise<PaymentResponse>;
    verifyPayment(token: string): Promise<MockVerificationResponse>;
    getBaseUrl(): string;
}
export declare const mockPayTechService: MockPayTechService;
