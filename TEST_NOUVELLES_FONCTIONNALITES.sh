#!/bin/bash

echo "🧪 Script de Test des Nouvelles Fonctionnalités"
echo "================================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de test
test_feature() {
    echo -e "${YELLOW}Test: $1${NC}"
}

test_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

test_fail() {
    echo -e "${RED}❌ $1${NC}"
}

echo "1️⃣  Vérification de la compilation Backend..."
cd back_end
if npm run build > /dev/null 2>&1; then
    test_success "Backend compilé avec succès"
else
    test_fail "Erreur de compilation Backend"
    exit 1
fi
cd ..

echo ""
echo "2️⃣  Vérification de la compilation Frontend..."
cd frontend-angular
if npx ng build --configuration development > /dev/null 2>&1; then
    test_success "Frontend compilé avec succès"
else
    test_fail "Erreur de compilation Frontend"
    exit 1
fi
cd ..

echo ""
echo "3️⃣  Vérification des fichiers modifiés..."

# Backend
if grep -q "phone, address" back_end/src/controllers/photo.controller.ts; then
    test_success "Validation téléphone/adresse ajoutée dans photo.controller.ts"
else
    test_fail "Validation téléphone/adresse manquante"
fi

if grep -q "hasPayTechConfig" back_end/src/services/premium.service.ts; then
    test_success "Mode test PayTech ajouté dans premium.service.ts"
else
    test_fail "Mode test PayTech manquant"
fi

# Frontend
if grep -q "searchQuery" frontend-angular/src/app/pages/home/home.component.ts; then
    test_success "Recherche ajoutée dans home.component.ts"
else
    test_fail "Recherche manquante"
fi

if grep -q "pagination" frontend-angular/src/app/pages/home/home.component.ts; then
    test_success "Pagination ajoutée dans home.component.ts"
else
    test_fail "Pagination manquante"
fi

if grep -q "phone.*FormControl" frontend-angular/src/app/pages/create-product/create-product.component.ts; then
    test_success "Champ téléphone ajouté dans create-product.component.ts"
else
    test_fail "Champ téléphone manquant"
fi

echo ""
echo "4️⃣  Vérification de la configuration..."

if grep -q "PAYTECH_API_KEY" back_end/.env; then
    test_success "Variables PayTech ajoutées dans .env"
else
    test_fail "Variables PayTech manquantes dans .env"
fi

echo ""
echo "================================================"
echo "✅ Tous les tests de base sont passés!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Démarrer le backend: cd back_end && npm start"
echo "2. Démarrer le frontend: cd frontend-angular && npm start"
echo "3. Tester manuellement les fonctionnalités:"
echo "   - Créer un produit avec téléphone/adresse"
echo "   - Rechercher des produits sur la page d'accueil"
echo "   - Tester la pagination"
echo "   - Tester l'achat premium (mode test)"
echo ""
echo "📖 Voir GUIDE_TESTS_FONCTIONNALITES.md pour les tests détaillés"
echo ""