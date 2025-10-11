# TODO pour Refaire Logique Modérateur

## Étape 1: Éditer auth.middleware.ts (Consolidation & Améliorations)
- [x] Améliorer requireAuth : Ajouter logs, check exp/iat.
- [x] Update requireModerator : Permettre ADMIN + MODERATOR, messages précis.
- [x] Ajouter requireAdmin : Pour stats.
- [x] Migrer isAdmin de role.middleware.ts ici.

## Étape 2: Simplifier role.middleware.ts
- [x] Supprimer requireModerator DB-based.
- [x] Garder/Supprimer isAdmin (migré).

## Étape 3: Mettre à Jour admin.route.ts
- [x] Importer de auth.middleware.ts only.
- [x] Utiliser requireModerator pour /moderator/* (permet ADMIN).

## Étape 4: Tests
- [x] Redémarrer serveur : npm run dev.
- [x] Test curl : Login modérateur → GET pending-products (200).
- [x] Test hiérarchie : Login ADMIN → même endpoint (200).
- [x] Test USER → 403 "Rôle insuffisant".

## Étape 5: Améliorations Optionnelles
- [x] Éditer generateToken.ts : Ajouter iat explicite.
- [x] Ajouter filter VALID dans photo.controller.ts listProducts (pour users voir seulement VALID) - Déjà présent.

Progress: 5/5 étapes complètes. Logique modérateur refaite et testée.
