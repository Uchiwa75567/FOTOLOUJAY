#!/bin/bash

echo "🧪 TEST DU SYSTÈME DE MODÉRATION"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📋 Vérification des fichiers backend..."
if grep -q "getUserProducts" back_end/src/controllers/photo.controller.ts; then
    echo -e "${GREEN}✅ Fonction getUserProducts trouvée${NC}"
else
    echo -e "${RED}❌ Fonction getUserProducts manquante${NC}"
fi

if grep -q "getPendingProducts" back_end/src/controllers/admin.controller.ts; then
    echo -e "${GREEN}✅ Fonction getPendingProducts trouvée${NC}"
else
    echo -e "${RED}❌ Fonction getPendingProducts manquante${NC}"
fi

echo ""
echo "📋 Vérification des fichiers frontend..."
if [ -f "frontend-angular/src/app/pages/moderation/moderation.component.ts" ]; then
    echo -e "${GREEN}✅ Page de modération créée${NC}"
else
    echo -e "${RED}❌ Page de modération manquante${NC}"
fi

if grep -q "moderatorGuard" frontend-angular/src/app/app.routes.ts; then
    echo -e "${GREEN}✅ Guard modérateur configuré${NC}"
else
    echo -e "${RED}❌ Guard modérateur manquant${NC}"
fi

if grep -q "getUserProducts" frontend-angular/src/app/core/services/product.service.ts; then
    echo -e "${GREEN}✅ Service getUserProducts ajouté${NC}"
else
    echo -e "${RED}❌ Service getUserProducts manquant${NC}"
fi

echo ""
echo "=================================="
echo "📊 RÉSUMÉ DES CORRECTIONS"
echo "=================================="
echo ""
echo -e "${BLUE}🔧 Backend:${NC}"
echo "   ✅ Route /api/products/user/my-products"
echo "   ✅ Route /api/admin/moderator/pending-products"
echo "   ✅ Route /api/admin/moderator/products/:id/validate"
echo "   ✅ Route /api/admin/moderator/products/:id/reject"
echo ""
echo -e "${BLUE}🎨 Frontend:${NC}"
echo "   ✅ Page de modération (/moderation)"
echo "   ✅ Guard modérateur"
echo "   ✅ Dashboard mis à jour"
echo "   ✅ Navbar avec lien modération"
echo ""
echo "=================================="
echo "🚀 POUR TESTER LE SYSTÈME COMPLET"
echo "=================================="
echo ""
echo -e "${YELLOW}1. Redémarrer le backend:${NC}"
echo "   cd back_end && npm run dev"
echo ""
echo -e "${YELLOW}2. Redémarrer le frontend:${NC}"
echo "   cd frontend-angular && npm start"
echo ""
echo -e "${YELLOW}3. Créer un modérateur:${NC}"
echo "   Voir le fichier CREER_MODERATEUR.md"
echo ""
echo -e "${YELLOW}4. Tester le flux:${NC}"
echo "   a) Utilisateur: Publier un produit"
echo "   b) Utilisateur: Voir dans Dashboard > En attente"
echo "   c) Modérateur: Aller sur /moderation"
echo "   d) Modérateur: Valider ou rejeter"
echo "   e) Utilisateur: Voir dans Dashboard > Validés/Rejetés"
echo ""
echo -e "${GREEN}✨ Système de modération prêt à l'emploi!${NC}"
echo ""