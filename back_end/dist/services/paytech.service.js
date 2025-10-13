"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payTechService = exports.PayTechService = void 0;
const axios_1 = __importDefault(require("axios"));
class PayTechService {
    constructor() {
        this.config = {
            apiKey: process.env.PAYTECH_API_KEY || '',
            secretKey: process.env.PAYTECH_SECRET_KEY || '',
            baseUrl: 'https://paytech.sn'
        };
    }
    async createPayment(paymentData) {
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
            const response = await axios_1.default.post(`${this.config.baseUrl}/api/payment/request-payment`, payload, {
                headers: {
                    'API_KEY': this.config.apiKey,
                    'API_SECRET': this.config.secretKey,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Erreur PayTech:', error.response?.data || error.message);
            throw new Error('Erreur lors de la création du paiement PayTech');
        }
    }
    async verifyPayment(token) {
        try {
            const response = await axios_1.default.get(`${this.config.baseUrl}/api/payment/verify/${token}`, {
                headers: {
                    'API_KEY': this.config.apiKey,
                    'API_SECRET': this.config.secretKey,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Erreur vérification PayTech:', error.response?.data || error.message);
            throw new Error('Erreur lors de la vérification du paiement');
        }
    }
}
exports.PayTechService = PayTechService;
exports.payTechService = new PayTechService();
//# sourceMappingURL=paytech.service.js.map