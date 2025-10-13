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

export class MockPayTechService {
  private baseUrl = 'https://mock-paytech.example.com';

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log('🔧 MockPayTech: Creating payment request:', request);

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer un token de test
    const token = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response: PaymentResponse = {
      success: 1,
      token: token,
      redirect_url: `http://localhost:4200/dashboard?payment=mock&token=${token}`,
      error: undefined
    };

    console.log('🔧 MockPayTech: Payment created successfully:', response);
    return response;
  }

  async verifyPayment(token: string): Promise<MockVerificationResponse> {
    console.log('🔧 MockPayTech: Verifying payment for token:', token);

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));

    // Pour les tokens mock, toujours retourner succès
    if (token.startsWith('MOCK_')) {
      const response: MockVerificationResponse = {
        success: 1,
        status: 'completed',
        amount: '500', // Montant par défaut
        currency: 'XOF',
        payment_date: new Date().toISOString(),
        custom_field: JSON.stringify({
          userId: 1,
          packId: 'week_500',
          refCommand: 'MOCK_REF_COMMAND'
        })
      };

      console.log('🔧 MockPayTech: Payment verified successfully:', response);
      return response;
    }

    // Pour les vrais tokens, simuler un échec
    const response: MockVerificationResponse = {
      success: 0,
      status: 'failed',
      error: 'Token non reconnu en mode mock'
    };

    console.log('🔧 MockPayTech: Payment verification failed:', response);
    return response;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Instance singleton
export const mockPayTechService = new MockPayTechService();
