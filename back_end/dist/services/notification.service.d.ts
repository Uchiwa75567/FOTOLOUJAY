export declare const sendEmail: (to: string, subject: string, text: string) => Promise<void>;
export declare const notifyProductValidated: (userEmail: string, productTitle: string) => Promise<void>;
export declare const notifyProductRejected: (userEmail: string, productTitle: string, reason?: string) => Promise<void>;
export declare const notifyProductReminder: (userEmail: string, productTitle: string) => Promise<void>;
