"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPremiumStatus = exports.getPremiumStatus = exports.processPremiumPayment = exports.initiatePremiumPayment = void 0;
const client_1 = require("@prisma/client");
const paytech_service_1 = require("./paytech.service");
const mock_paytech_service_1 = require("./mock-paytech.service");
const prisma = new client_1.PrismaClient();
const PREMIUM_PACKS = [
    { id: "week_500", name: "Pack Semaine", price: 500, duration: 7, unit: "jours" },
    { id: "month_3000", name: "Pack Mois", price: 3000, duration: 30, unit: "jours" },
    { id: "month_20000", name: "Pack Premium", price: 20000, duration: 30, unit: "jours" }
];
const initiatePremiumPayment = async (userId, packId) => {
    try {
        const pack = PREMIUM_PACKS.find(p => p.id === packId);
        if (!pack) {
            throw new Error("Pack premium invalide");
        }
        // Générer une référence unique pour la commande
        const refCommand = `PREMIUM_${userId}_${packId}_${Date.now()}`;
        // Utiliser MockPayTech si activé via variable d'environnement
        const useMockPayTech = process.env.USE_MOCK_PAYTECH === 'true';
        const payTechServiceToUse = useMockPayTech ? mock_paytech_service_1.mockPayTechService : paytech_service_1.payTechService;
        console.log(`🔧 Utilisation du service PayTech: ${useMockPayTech ? 'MOCK' : 'REAL'}`);
        // Créer la demande de paiement
        const paymentRequest = {
            item_name: pack.name,
            item_price: pack.price,
            currency: 'XOF',
            ref_command: refCommand,
            command_name: `Abonnement Premium - ${pack.name}`,
            env: process.env.PAYTECH_ENV === 'prod' ? 'prod' : 'test',
            ipn_url: `https://webhook.site/12345678`, // URL HTTPS temporaire pour les tests
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/dashboard?payment=cancelled`,
            custom_field: JSON.stringify({ userId, packId, refCommand })
        };
        const paymentResponse = await payTechServiceToUse.createPayment(paymentRequest);
        if (paymentResponse.success === 1 && paymentResponse.token) {
            // Sauvegarder la transaction en attente dans la base de données
            await prisma.paymentTransaction.create({
                data: {
                    refCommand,
                    userId,
                    packId,
                    amount: pack.price,
                    status: 'PENDING',
                    token: paymentResponse.token,
                    createdAt: new Date()
                }
            });
            return {
                success: true,
                paymentUrl: paymentResponse.redirect_url,
                token: paymentResponse.token,
                refCommand,
                pack
            };
        }
        else {
            throw new Error(paymentResponse.error || 'Erreur lors de la création du paiement');
        }
    }
    catch (error) {
        console.error("Erreur lors de l'initiation du paiement premium:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.initiatePremiumPayment = initiatePremiumPayment;
const processPremiumPayment = async (token) => {
    try {
        // Utiliser MockPayTech pour la vérification si activé
        const useMockPayTech = process.env.USE_MOCK_PAYTECH === 'true';
        const payTechServiceToUse = useMockPayTech ? mock_paytech_service_1.mockPayTechService : paytech_service_1.payTechService;
        console.log(`🔧 Vérification du paiement avec: ${useMockPayTech ? 'MOCK' : 'REAL'}`);
        // Vérifier le paiement avec PayTech
        const verification = await payTechServiceToUse.verifyPayment(token);
        if (verification.success !== 1) {
            throw new Error('Paiement échoué ou annulé');
        }
        // Récupérer la transaction
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { token },
            include: { user: true }
        });
        if (!transaction || transaction.status !== 'PENDING') {
            throw new Error('Transaction non trouvée ou déjà traitée');
        }
        const pack = PREMIUM_PACKS.find(p => p.id === transaction.packId);
        if (!pack) {
            throw new Error('Pack invalide');
        }
        // Calculer la nouvelle date d'expiration
        const now = new Date();
        let expiryDate;
        if (transaction.user.premiumExpiry && transaction.user.premiumExpiry > now) {
            // Étendre l'abonnement existant
            expiryDate = new Date(transaction.user.premiumExpiry.getTime() + (pack.duration * 24 * 60 * 60 * 1000));
        }
        else {
            // Créer un nouvel abonnement
            expiryDate = new Date(now.getTime() + (pack.duration * 24 * 60 * 60 * 1000));
        }
        // Mettre à jour l'utilisateur et la transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: transaction.userId },
                data: { premiumExpiry: expiryDate }
            }),
            prisma.paymentTransaction.update({
                where: { token },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date()
                }
            })
        ]);
        return {
            success: true,
            message: `Pack ${pack.name} acheté avec succès`,
            pack,
            premiumExpiry: expiryDate,
            daysRemaining: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        };
    }
    catch (error) {
        console.error("Erreur lors du traitement du paiement premium:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.processPremiumPayment = processPremiumPayment;
const getPremiumStatus = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { premiumExpiry: true, role: true }
        });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        const now = new Date();
        const isPremium = user.premiumExpiry && user.premiumExpiry > now;
        const daysRemaining = isPremium
            ? Math.ceil((user.premiumExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        return {
            isPremium,
            premiumExpiry: user.premiumExpiry,
            daysRemaining
        };
    }
    catch (error) {
        console.error("Erreur lors de la récupération du statut premium:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.getPremiumStatus = getPremiumStatus;
const checkPremiumStatus = async (userId) => {
    try {
        const status = await (0, exports.getPremiumStatus)(userId);
        return status.isPremium ?? false;
    }
    catch (error) {
        console.error("Erreur lors de la vérification du statut premium:", error);
        return false;
    }
};
exports.checkPremiumStatus = checkPremiumStatus;
//# sourceMappingURL=premium.service.js.map