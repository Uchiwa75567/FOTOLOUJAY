# FOTOL JAY - Frontend Angular

Application Angular pour la marketplace FOTOL JAY.

## Prérequis

- Node.js (v18 ou supérieur)
- npm

## Installation

```bash
npm install
```

## Configuration

L'API backend doit être accessible sur `http://localhost:3001/api`. 
Vous pouvez modifier cette URL dans `src/environments/environment.ts`.

## Développement

Lancez le serveur de développement :

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`.

## Build

Pour créer une version de production :

```bash
npm run build
```

Les fichiers de build seront dans le dossier `dist/`.

## Fonctionnalités

- 🔐 Authentification (Login/Register)
- 🏠 Page d'accueil avec liste des produits
- 📊 Dashboard utilisateur
- 👑 Panel administrateur avec statistiques
- 📦 Gestion des produits
- 🔄 Intercepteurs HTTP pour la gestion des tokens
- 🎨 Design moderne et responsive

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Guards de navigation
│   │   ├── interceptors/    # Intercepteurs HTTP
│   │   └── services/        # Services (Auth, Product, Admin)
│   ├── pages/               # Pages de l'application
│   │   ├── home/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── shared/
│   │   └── components/      # Composants réutilisables
│   └── app.routes.ts        # Configuration des routes
├── environments/            # Configuration d'environnement
└── styles.scss             # Styles globaux
```

## API Backend

L'application consomme les endpoints suivants :

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/refresh` - Rafraîchissement du token
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Création d'un produit
- `GET /api/admin/stats` - Statistiques admin