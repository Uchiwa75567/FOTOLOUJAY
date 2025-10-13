import axios from 'axios';

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

export class PayTechService {
  private config: PayTechConfig;

  constructor() {
    this.config = {
      apiKey: process.env.PAYTECH_API_KEY || '',
      secretKey: process.env.PAYTECH_SECRET_KEY || '',
      baseUrl: 'https://paytech.sn'
    };
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        item_name: paymentData.item_name,
        item_price: paymentData.item_price.toString(),
        currency: paymentData.currency,
        ref_command: paymentData.ref_command,
        command_name: paymentData.command_name,
        env: paymentData.env,
        ipn_url: paymentData.ipn_url,
        success_url: paymentData.success_url,
        cancel_url: paymentData.cancel_url,
        custom_field: paymentData.custom_field || ''
      };

      const response = await axios.post(
        `${this.config.baseUrl}/api/payment/request-payment`,
        payload,
        {
          headers: {
            'API_KEY': this.config.apiKey,
            'API_SECRET': this.config.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erreur PayTech:', error.response?.data || error.message);
      throw new Error('Erreur lors de la création du paiement PayTech');
    }
  }

  async verifyPayment(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/api/payment/verify/${token}`,
        {
          headers: {
            'API_KEY': this.config.apiKey,
            'API_SECRET': this.config.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erreur vérification PayTech:', error.response?.data || error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }
}

export const payTechService = new PayTechService();
