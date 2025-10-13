# 🚀 Guide de Démarrage Rapide - FOTOLJAY

## 🎨 Nouvelles Fonctionnalités Implémentées

### ✅ Thème aux Couleurs du Sénégal 🇸🇳
- Vert (#00853F) - Couleur primaire
- Jaune (#FCD116) - Accents
- Rouge (#E31B23) - Erreurs

### ✅ Page "Commencer à Vendre"
- Capture photo via caméra mobile
- Formulaire de publication de produit
- Validation en temps réel
- Redirection intelligente après connexion

## 🏃 Démarrage

### 1. Backend (Terminal 1)
```bash
cd back_end
npm run dev
```
Le backend démarre sur **http://localhost:3001**

### 2. Frontend (Terminal 2)
```bash
cd frontend-angular
npm install  # Si première fois
npm start
```
Le frontend démarre sur **http://localhost:4200**

## 📱 Tester la Nouvelle Fonctionnalité

### Scénario 1 : Utilisateur Non Connecté
1. Ouvrez **http://localhost:4200**
2. Cliquez sur **"Commencer à vendre"** (bouton vert)
3. Vous êtes redirigé vers la page de connexion
4. Connectez-vous avec :
   - Email : `user1@fotoloujay.com`
   - Mot de passe : `user123`
5. Vous êtes automatiquement redirigé vers la page de création

### Scénario 2 : Utilisateur Connecté
1. Connectez-vous d'abord
2. Cliquez sur **"Vendre"** dans le menu (avec icône caméra)
3. Accès direct à la page de création

### Scénario 3 : Créer un Produit
1. Sur la page `/create-product`
2. Cliquez sur **"Ouvrir la caméra"**
3. Autorisez l'accès à la caméra
4. Prenez une photo de votre produit
5. Cliquez sur **"Confirmer"**
6. Remplissez le formulaire :
   - **Titre** : Ex: "iPhone 13 Pro Max"
   - **Description** : Au moins 10 caractères
7. Cliquez sur **"Publier le produit"**
8. Message de succès : "✅ Produit créé avec succès !"
9. Redirection automatique vers le dashboard

## 🎯 Points Clés

### Navigation
- **Page d'accueil** → Bouton "Commencer à vendre" (vert)
- **Menu** → Lien "Vendre" (avec icône caméra)
- **Après publication** → Redirection vers dashboard

### Validation
- ✅ Photo obligatoire (capturée, pas uploadée)
- ✅ Titre obligatoire (max 100 caractères)
- ✅ Description obligatoire (min 10, max 1000 caractères)

### Statut du Produit
- Après publication : **PENDING** (en attente)
- Visible dans le dashboard utilisateur
- Nécessite validation par un modérateur
- Notification email après validation/rejet

## 🔧 Dépannage

### Erreur "Permission caméra refusée"
- Vérifiez les paramètres de votre navigateur
- Autorisez l'accès à la caméra pour localhost

### Erreur "Aucune caméra trouvée"
- Vérifiez qu'une caméra est connectée
- Testez sur un appareil mobile

### Erreur de compilation
```bash
cd frontend-angular
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend ne démarre pas
```bash
cd back_end
npm install
npx prisma generate
npm run dev
```

## 📊 Comptes de Test

### Utilisateur Standard
- Email : `user1@fotoloujay.com`
- Mot de passe : `user123`
- Peut créer des produits

### Modérateur
- Email : `moderator1@fotoloujay.com`
- Mot de passe : `moderator123`
- Peut valider/rejeter les produits

### Administrateur
- Email : `admin@fotoloujay.com`
- Mot de passe : `admin123`
- Accès complet + statistiques

## 🎨 Changements Visuels

Tous les éléments bleus sont maintenant **verts** :
- Boutons primaires
- Liens actifs
- Icônes
- Bordures de focus
- Messages de succès

Les accents jaunes apparaissent dans :
- Messages d'information
- Avertissements

Les erreurs sont en rouge :
- Messages d'erreur
- Validations échouées

## 📝 Fichiers Modifiés

### Nouveaux Composants
- `frontend-angular/src/app/pages/create-product/` (3 fichiers)
- `frontend-angular/src/app/shared/components/camera/` (3 fichiers)

### Fichiers Modifiés
- `frontend-angular/src/styles.scss` (couleurs)
- `frontend-angular/src/app/app.routes.ts` (nouvelle route)
- `frontend-angular/src/app/pages/home/` (navigation)
- `frontend-angular/src/app/pages/login/` (returnUrl)
- `frontend-angular/src/app/shared/components/navbar/` (lien Vendre)

## ✨ Prochaines Étapes

1. Testez la fonctionnalité complète
2. Vérifiez sur mobile (responsive)
3. Testez avec différents navigateurs
4. Créez plusieurs produits de test
5. Testez la modération (compte modérateur)

---

**Bon développement ! 🇸🇳**