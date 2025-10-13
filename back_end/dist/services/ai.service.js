"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeProductImage = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY manquante dans .env - Impossible d'analyser les images");
}
const analyzeProductImage = async (imagePath, title) => {
    try {
        // Lire l'image en base64
        const imageBuffer = fs_1.default.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");
        const mimeType = "image/jpeg"; // Adapter selon l'extension
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyse cette image de produit à vendre. Vérifie si elle contient du contenu inapproprié (pornographie, violence, propagande politique, publicité illégale, armes, drogues). Si l'image est valide pour un site de vente de produits, génère une description détaillée et objective du produit (incluant type, état, utilisation). Si invalide, explique pourquoi.

Titre fourni par l'utilisateur: "${title}"

Réponds en JSON avec:
- "isValid": true/false
- "reason": explication si invalide, null si valide
- "description": description générée si valide, null si invalide`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        });
        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("Aucune réponse de l'IA");
        }
        const analysis = JSON.parse(content);
        return analysis;
    }
    catch (error) {
        console.error("Erreur analyse IA:", error);
        throw new Error("Erreur lors de l'analyse de l'image par l'IA");
    }
};
exports.analyzeProductImage = analyzeProductImage;
//# sourceMappingURL=ai.service.js.map