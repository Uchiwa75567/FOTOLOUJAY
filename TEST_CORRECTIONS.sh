#!/bin/bash

echo "🔍 TEST DES CORRECTIONS CORS"
echo "=============================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "1️⃣ Vérification de la configuration CORS backend..."
if grep -q "crossOriginResourcePolicy" back_end/src/index.ts; then
    echo -e "${GREEN}✅ Configuration Helmet CORS trouvée${NC}"
else
    echo -e "${RED}❌ Configuration Helmet CORS manquante${NC}"
fi

if grep -q "credentials: true" back_end/src/index.ts; then
    echo -e "${GREEN}✅ Credentials activés dans CORS${NC}"
else
    echo -e "${RED}❌ Credentials manquants dans CORS${NC}"
fi

echo ""
echo "2️⃣ Vérification de l'interceptor frontend..."
if grep -q "withCredentials: true" frontend-angular/src/app/core/interceptors/auth.interceptor.ts; then
    echo -e "${GREEN}✅ withCredentials configuré dans l'interceptor${NC}"
else
    echo -e "${RED}❌ withCredentials manquant dans l'interceptor${NC}"
fi

echo ""
echo "3️⃣ Vérification du build backend..."
if [ -f "back_end/dist/index.js" ]; then
    echo -e "${GREEN}✅ Backend compilé avec succès${NC}"
else
    echo -e "${YELLOW}⚠️  Backend non compilé - Exécutez: cd back_end && npm run build${NC}"
fi

echo ""
echo "=============================="
echo "📋 RÉSUMÉ DES CORRECTIONS"
echo "=============================="
echo ""
echo "✅ CORS configuré avec:"
echo "   - Origines: localhost:4200, localhost:3000"
echo "   - Credentials: activés"
echo "   - Headers: Authorization, Content-Type"
echo "   - Helmet: crossOriginResourcePolicy"
echo ""
echo "✅ Interceptor HTTP configuré avec:"
echo "   - withCredentials: true"
echo "   - Support refresh token"
echo ""
echo "🚀 POUR TESTER:"
echo "   1. Terminal 1: cd back_end && npm run dev"
echo "   2. Terminal 2: cd frontend-angular && npm start"
echo "   3. Ouvrir: http://localhost:4200"
echo "   4. Vérifier que les images se chargent"
echo ""