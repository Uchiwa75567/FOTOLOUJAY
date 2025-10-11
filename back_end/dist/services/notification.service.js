"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyProductReminder = exports.notifyProductRejected = exports.notifyProductValidated = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
exports.sendEmail = sendEmail;
const notifyProductValidated = async (userEmail, productTitle) => {
    const subject = "Votre produit a été validé";
    const text = `Bonjour,\n\nVotre produit "${productTitle}" a été validé et est maintenant visible sur la plateforme.\n\nCordialement,\nL'équipe FOTOL JAY`;
    await (0, exports.sendEmail)(userEmail, subject, text);
};
exports.notifyProductValidated = notifyProductValidated;
const notifyProductRejected = async (userEmail, productTitle, reason) => {
    const subject = "Votre produit a été rejeté";
    const text = `Bonjour,\n\nVotre produit "${productTitle}" a été rejeté.${reason ? ` Raison: ${reason}` : ""}\n\nVous pouvez le modifier et le republier.\n\nCordialement,\nL'équipe FOTOL JAY`;
    await (0, exports.sendEmail)(userEmail, subject, text);
};
exports.notifyProductRejected = notifyProductRejected;
const notifyProductReminder = async (userEmail, productTitle) => {
    const subject = "Rappel: Votre produit sera bientôt supprimé";
    const text = `Bonjour,\n\nVotre produit "${productTitle}" sera supprimé dans 1 jour. Pensez à le republier si nécessaire.\n\nCordialement,\nL'équipe FOTOL JAY`;
    await (0, exports.sendEmail)(userEmail, subject, text);
};
exports.notifyProductReminder = notifyProductReminder;
//# sourceMappingURL=notification.service.js.map