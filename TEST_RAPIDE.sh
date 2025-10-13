#!/bin/bash

echo "🇸🇳 FOTOLJAY - Test Rapide des Nouvelles Fonctionnalités"
echo "=========================================================="
echo ""

# Vérifier si nous sommes dans le bon répertoire
if [ ! -d "frontend-angular" ] || [ ! -d "back_end" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet FOTOLJAY"
    exit 1
fi

echo "✅ Répertoire correct détecté"
echo ""

# Fonction pour vérifier si un port est utilisé
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Vérifier le backend
echo "🔍 Vérification du backend (port 3001)..."
if check_port 3001; then
    echo "✅ Backend déjà démarré sur le port 3001"
else
    echo "⚠️  Backend non démarré. Lancez-le avec:"
    echo "   cd back_end && npm run dev"
fi
echo ""

# Vérifier le frontend
echo "🔍 Vérification du frontend (port 4200)..."
if check_port 4200; then
    echo "✅ Frontend déjà démarré sur le port 4200"
else
    echo "⚠️  Frontend non démarré. Lancez-le avec:"
    echo "   cd frontend-angular && npm start"
fi
echo ""

# Instructions de test
echo "📋 Instructions de Test"
echo "======================="
echo ""
echo "1. 🌐 Ouvrez votre navigateur sur: http://localhost:4200"
echo ""
echo "2. 🎨 Vérifiez le nouveau thème:"
echo "   - Les boutons sont maintenant VERTS (couleur Sénégal)"
echo "   - Les accents sont JAUNES"
echo "   - Les erreurs sont ROUGES"
echo ""
echo "3. 📸 Testez la fonctionnalité 'Commencer à vendre':"
echo "   a) Cliquez sur le bouton vert 'Commencer à vendre'"
echo "   b) Connectez-vous avec:"
echo "      Email: user1@fotoloujay.com"
echo "      Mot de passe: user123"
echo "   c) Vous serez redirigé vers la page de création"
echo ""
echo "4. 📷 Testez la capture photo:"
echo "   a) Cliquez sur 'Ouvrir la caméra'"
echo "   b) Autorisez l'accès à la caméra"
echo "   c) Prenez une photo"
echo "   d) Confirmez ou reprenez"
echo ""
echo "5. 📝 Testez le formulaire:"
echo "   a) Entrez un titre (ex: 'iPhone 13')"
echo "   b) Entrez une description (min 10 caractères)"
echo "   c) Cliquez sur 'Publier le produit'"
echo "   d) Vérifiez le message de succès"
echo "   e) Vous serez redirigé vers le dashboard"
echo ""
echo "6. ✅ Vérifications finales:"
echo "   - Le produit apparaît dans votre dashboard"
echo "   - Le statut est 'PENDING'"
echo "   - Le lien 'Vendre' est visible dans le menu"
echo ""
echo "=========================================================="
echo "🎉 Bon test ! 🇸🇳"
echo ""