import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY manquante dans .env - Impossible d'analyser les images");
}

export const analyzeProductImage = async (imagePath: string, title: string) => {
  try {
    // Lire l'image en base64
    const imageBuffer = fs.readFileSync(imagePath);
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
  } catch (error) {
    console.error("Erreur analyse IA:", error);
    throw new Error("Erreur lors de l'analyse de l'image par l'IA");
  }
};
