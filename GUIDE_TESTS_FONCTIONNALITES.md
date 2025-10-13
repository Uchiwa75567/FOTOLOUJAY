# 🧪 Guide de Tests des Nouvelles Fonctionnalités

## 📋 Résumé des Changements

### 1. ✅ Téléphone et Adresse à Chaque Publication
- **Avant** : Demandé une seule fois via modal
- **Après** : Demandé à chaque création de produit dans le formulaire
- **Avantage** : L'utilisateur peut changer ses coordonnées pour chaque produit

### 2. 🔍 Recherche et Pagination sur la Page d'Accueil
- **Barre de recherche** : Recherche en temps réel dans titre, description et vendeur
- **Pagination** : 12 produits par page avec navigation
- **Compteur** : Affiche le nombre de résultats

### 3. 💳 Configuration PayTech
- **Mode test automatique** : Fonctionne sans clés PayTech
- **Configuration** : Variables d'environnement ajoutées dans `.env`

---

## 🧪 Plan de Tests

### Test 1 : Création de Produit avec Téléphone et Adresse

#### Étapes :
1. Se connecter à l'application
2. Aller sur "Vendre" ou `/create-product`
3. Vérifier que le formulaire contient :
   - ✅ Titre du produit
   - ✅ Description
   - ✅ **Téléphone** (nouveau champ)
   - ✅ **Adresse** (nouveau champ)
4. Capturer une photo
5. Remplir tous les champs

#### Tests de Validation :

**Test 1.1 : Téléphone invalide**
```
Entrée : "12345678"
Résultat attendu : Erreur "Format invalide - doit commencer par 77, 78, 76, 70 ou 75 (9 chiffres)"
```

**Test 1.2 : Téléphone valide**
```
Entrées valides :
- "771234567"
- "781234567"
- "761234567"
- "701234567"
- "751234567"
Résultat attendu : Accepté ✅
```

**Test 1.3 : Adresse trop courte**
```
Entrée : "Dakar"
Résultat attendu : Erreur "L'adresse doit contenir au moins 5 caractères"
```

**Test 1.4 : Adresse valide**
```
Entrée : "Liberté 6, Dakar"
Résultat attendu : Accepté ✅
```

**Test 1.5 : Soumission complète**
```
1. Remplir tous les champs correctement
2. Cliquer sur "Publier le produit"
3. Vérifier le message de succès
4. Vérifier que le produit est en attente de modération
```

#### Vérification Backend :
```bash
# Vérifier que le téléphone et l'adresse sont sauvegardés
# Dans la base de données, table User
SELECT id, username, phone, address FROM User WHERE id = [user_id];
```

---

### Test 2 : Recherche de Produits

#### Étapes :
1. Aller sur la page d'accueil `/`
2. Scroller jusqu'à la section "Produits disponibles"
3. Utiliser la barre de recherche

#### Tests de Recherche :

**Test 2.1 : Recherche par titre**
```
1. Taper "iPhone" dans la barre de recherche
2. Vérifier que seuls les produits avec "iPhone" dans le titre s'affichent
3. Vérifier le compteur de résultats
```

**Test 2.2 : Recherche par description**
```
1. Taper un mot présent dans une description
2. Vérifier que les produits correspondants s'affichent
```

**Test 2.3 : Recherche par vendeur**
```
1. Taper un nom d'utilisateur
2. Vérifier que les produits de ce vendeur s'affichent
```

**Test 2.4 : Recherche sans résultat**
```
1. Taper "xyzabc123" (texte inexistant)
2. Vérifier le message "Aucun produit trouvé pour 'xyzabc123'"
3. Vérifier le bouton "Réinitialiser la recherche"
4. Cliquer sur le bouton
5. Vérifier que tous les produits réapparaissent
```

**Test 2.5 : Effacer la recherche**
```
1. Faire une recherche
2. Cliquer sur le bouton X dans la barre de recherche
3. Vérifier que tous les produits réapparaissent
```

---

### Test 3 : Pagination

#### Prérequis :
- Avoir plus de 12 produits dans la base de données

#### Tests de Pagination :

**Test 3.1 : Affichage initial**
```
1. Aller sur la page d'accueil
2. Vérifier que maximum 12 produits sont affichés
3. Vérifier que la pagination est visible en bas
4. Vérifier que le bouton "Précédent" est désactivé
```

**Test 3.2 : Navigation vers page suivante**
```
1. Cliquer sur "Suivant" ou sur le numéro de page 2
2. Vérifier que 12 nouveaux produits s'affichent
3. Vérifier que le bouton "Précédent" est maintenant actif
4. Vérifier que la page défile automatiquement vers le haut
```

**Test 3.3 : Navigation vers page précédente**
```
1. Depuis la page 2, cliquer sur "Précédent"
2. Vérifier le retour à la page 1
3. Vérifier que les mêmes produits qu'initialement s'affichent
```

**Test 3.4 : Navigation directe**
```
1. Cliquer directement sur un numéro de page (ex: 3)
2. Vérifier que la page 3 s'affiche
3. Vérifier que le numéro est surligné
```

**Test 3.5 : Pagination avec recherche**
```
1. Faire une recherche qui retourne plus de 12 résultats
2. Vérifier que la pagination s'adapte
3. Naviguer entre les pages de résultats
4. Effacer la recherche
5. Vérifier que la pagination revient à la page 1
```

**Test 3.6 : Dernière page**
```
1. Aller à la dernière page
2. Vérifier que le bouton "Suivant" est désactivé
3. Vérifier que moins de 12 produits peuvent s'afficher
```

---

### Test 4 : Configuration PayTech

#### Test 4.1 : Mode Test (sans clés)
```
1. S'assurer que PAYTECH_API_KEY et PAYTECH_SECRET_KEY sont vides dans .env
2. Se connecter et aller sur /premium
3. Cliquer sur "Choisir ce pack" pour n'importe quel pack
4. Vérifier la redirection vers dashboard avec ?payment=test
5. Vérifier dans la console backend : "⚠️ PayTech non configuré - Mode test activé"
```

#### Test 4.2 : Configuration des Clés PayTech
```
1. Obtenir des clés de test sur https://paytech.sn
2. Ajouter dans back_end/.env :
   PAYTECH_API_KEY="votre_cle_test"
   PAYTECH_SECRET_KEY="votre_secret_test"
   PAYTECH_ENV="test"
3. Redémarrer le serveur backend
4. Tester l'achat d'un pack premium
5. Vérifier la redirection vers PayTech
```

---

## 🔧 Commandes de Test

### Démarrer l'Application

**Backend :**
```bash
cd back_end
npm run build
npm start
# ou en mode dev
npm run dev
```

**Frontend :**
```bash
cd frontend-angular
npm start
# L'application sera disponible sur http://localhost:4200
```

### Créer des Produits de Test

**Script SQL pour créer des produits :**
```sql
-- Créer 20 produits de test pour tester la pagination
INSERT INTO Product (title, description, photoUrl, userId, status, createdAt, updatedAt)
SELECT 
  CONCAT('Produit Test ', n),
  CONCAT('Description du produit test numéro ', n, '. Ceci est un produit de test pour vérifier la pagination.'),
  '/uploads/test.jpg',
  1, -- Remplacer par un ID utilisateur valide
  'VALID',
  NOW(),
  NOW()
FROM (
  SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
  UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
) numbers;
```

---

## ✅ Checklist de Validation

### Création de Produit
- [ ] Le champ téléphone est présent et obligatoire
- [ ] Le champ adresse est présent et obligatoire
- [ ] La validation du téléphone fonctionne (format sénégalais)
- [ ] La validation de l'adresse fonctionne (minimum 5 caractères)
- [ ] Les données sont sauvegardées dans la table User
- [ ] Le produit est créé avec succès
- [ ] L'utilisateur peut changer téléphone/adresse à chaque publication

### Recherche
- [ ] La barre de recherche est visible sur la page d'accueil
- [ ] La recherche fonctionne en temps réel
- [ ] La recherche trouve les produits par titre
- [ ] La recherche trouve les produits par description
- [ ] La recherche trouve les produits par nom de vendeur
- [ ] Le compteur de résultats s'affiche correctement
- [ ] Le bouton X efface la recherche
- [ ] Le message "Aucun résultat" s'affiche si nécessaire

### Pagination
- [ ] Maximum 12 produits par page
- [ ] Les boutons Précédent/Suivant fonctionnent
- [ ] La navigation par numéro de page fonctionne
- [ ] Le numéro de page actif est surligné
- [ ] Les boutons sont désactivés aux extrémités
- [ ] Le scroll automatique vers le haut fonctionne
- [ ] La pagination s'adapte aux résultats de recherche
- [ ] Les points de suspension (...) s'affichent correctement

### PayTech
- [ ] Le mode test fonctionne sans clés
- [ ] Le message de mode test apparaît dans la console
- [ ] La configuration des clés fonctionne
- [ ] La redirection vers PayTech fonctionne (avec clés)

---

## 🐛 Problèmes Connus et Solutions

### Problème 1 : "Cannot read property 'length' of undefined"
**Solution :** Vérifier que `allProducts` est initialisé comme tableau vide

### Problème 2 : La pagination ne s'affiche pas
**Solution :** Vérifier qu'il y a plus de 12 produits dans la base de données

### Problème 3 : La recherche ne fonctionne pas
**Solution :** Vérifier que `FormsModule` est importé dans le composant

### Problème 4 : Erreur 400 lors de la création de produit
**Solution :** Vérifier que téléphone et adresse sont bien envoyés dans la requête

---

## 📊 Métriques de Performance

### Temps de Réponse Attendus
- Recherche : < 100ms
- Changement de page : < 50ms
- Création de produit : < 2s
- Chargement initial : < 1s

### Limites
- Produits par page : 12
- Caractères minimum adresse : 5
- Caractères minimum description : 10
- Format téléphone : 9 chiffres (77/78/76/70/75)

---

## 📝 Notes pour les Développeurs

### Modifications Backend
- `photo.controller.ts` : Ajout validation téléphone et adresse
- `premium.service.ts` : Mode test automatique
- `.env` : Nouvelles variables PayTech

### Modifications Frontend
- `create-product.component.ts` : Champs téléphone/adresse dans le formulaire
- `home.component.ts` : Recherche et pagination
- `home.component.html` : UI recherche et pagination
- `home.component.scss` : Styles recherche et pagination

### Dépendances
- `FormsModule` : Ajouté pour ngModel dans la recherche
- Aucune nouvelle dépendance npm requise

---

**Date de création :** $(date)
**Version :** 2.0.0
**Statut :** ✅ Prêt pour les tests