# Instructions de démarrage - FOTOL JAY Angular

## ✅ Ce qui a été créé

J'ai créé une application Angular complète qui consomme votre API backend. Voici ce qui a été implémenté :

### 🎯 Fonctionnalités principales

1. **Authentification complète**
   - Page de connexion (`/login`)
   - Page d'inscription (`/register`)
   - Gestion des tokens JWT avec refresh automatique
   - Guards pour protéger les routes

2. **Pages publiques**
   - Page d'accueil avec liste des produits validés
   - Design moderne et responsive

3. **Dashboard utilisateur** (`/dashboard`)
   - Vue d'ensemble des produits de l'utilisateur
   - Statistiques (total, en attente, validés)
   - Filtrage par statut (tous, en attente, validés, rejetés)
   - Badges de statut sur les produits

4. **Panel administrateur** (`/admin`)
   - Statistiques complètes de la plateforme
   - Nombre d'utilisateurs, produits, VIP, modérateurs, etc.
   - Accessible uniquement aux administrateurs

### 🏗️ Architecture

```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── core/                    # Services et logique métier
│   │   │   ├── guards/              # Guards de navigation
│   │   │   │   ├── auth.guard.ts    # Protection des routes authentifiées
│   │   │   │   └── admin.guard.ts   # Protection des routes admin
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts  # Gestion automatique des tokens
│   │   │   └── services/
│   │   │       ├── auth.service.ts      # Authentification
│   │   │       ├── product.service.ts   # Gestion des produits
│   │   │       └── admin.service.ts     # Statistiques admin
│   │   ├── pages/                   # Pages de l'application
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── shared/
│   │   │   └── components/          # Composants réutilisables
│   │   │       ├── navbar/
│   │   │       └── product-card/
│   │   └── app.routes.ts            # Configuration des routes
│   ├── environments/                # Configuration d'environnement
│   └── styles.scss                  # Styles globaux
```

### 🔌 Endpoints API utilisés

L'application consomme les endpoints suivants de votre backend :

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription  
- `POST /api/auth/refresh` - Rafraîchissement du token
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Création d'un produit
- `GET /api/admin/stats` - Statistiques admin

### 🎨 Design

- Design moderne et responsive
- Palette de couleurs cohérente
- Composants réutilisables
- Animations et transitions fluides
- Support mobile et desktop

## 🚀 Comment démarrer

### 1. Assurez-vous que le backend est lancé

```bash
cd back_end
npm run dev
```

Le backend doit être accessible sur `http://localhost:3001`

### 2. Installez les dépendances (si ce n'est pas déjà fait)

```bash
cd frontend-angular
npm install
```

### 3. Lancez l'application Angular

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

### 4. Testez l'application

1. Ouvrez `http://localhost:4200` dans votre navigateur
2. Créez un compte via la page d'inscription
3. Connectez-vous
4. Explorez le dashboard

## 📝 Notes importantes

### Configuration de l'API

L'URL de l'API est configurée dans `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'
};
```

Si votre backend utilise un port différent, modifiez cette valeur.

### CORS

Assurez-vous que votre backend autorise les requêtes depuis `http://localhost:4200`. 
Votre configuration CORS actuelle dans `back_end/src/index.ts` devrait déjà le permettre :

```typescript
app.use(cors());
```

### Gestion des tokens

L'application utilise :
- `localStorage` pour stocker les tokens
- Un intercepteur HTTP pour ajouter automatiquement le token aux requêtes
- Un système de refresh automatique quand le token expire

## 🔧 Commandes utiles

```bash
# Démarrer en mode développement
npm start

# Build de production
npm run build

# Build en mode watch
npm run watch
```

## 🎯 Prochaines étapes possibles

1. **Ajout de fonctionnalités**
   - Page de création de produit avec capture photo
   - Page de détails d'un produit
   - Modération des produits (pour les modérateurs)
   - Gestion du profil utilisateur

2. **Améliorations**
   - Pagination des produits
   - Recherche et filtres
   - Upload d'images
   - Notifications en temps réel

3. **Tests**
   - Tests unitaires
   - Tests end-to-end

## 🐛 Dépannage

### L'application ne se lance pas

1. Vérifiez que Node.js est installé : `node --version`
2. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
3. Vérifiez qu'aucun autre processus n'utilise le port 4200

### Erreurs de connexion à l'API

1. Vérifiez que le backend est bien lancé sur le port 3001
2. Vérifiez l'URL de l'API dans `src/environments/environment.ts`
3. Vérifiez la console du navigateur pour les erreurs CORS

### Erreurs d'authentification

1. Vérifiez que les tokens sont bien stockés dans localStorage
2. Vérifiez que le backend renvoie bien les tokens dans la réponse
3. Vérifiez la console pour les erreurs d'intercepteur

## 📚 Ressources

- [Documentation Angular](https://angular.dev)
- [Documentation RxJS](https://rxjs.dev)
- [Guide Angular Router](https://angular.dev/guide/routing)

---

Bon développement ! 🚀