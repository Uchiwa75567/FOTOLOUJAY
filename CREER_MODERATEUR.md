# 👮 Créer un Compte Modérateur

## Option 1: Via la Base de Données (Recommandé)

### 1. Se connecter à MySQL
```bash
mysql -u bachir-dev -p
# Mot de passe: 776237675@BaChIr
```

### 2. Sélectionner la base de données
```sql
USE fotoloujay;
```

### 3. Voir les utilisateurs existants
```sql
SELECT id, username, email, role FROM User;
```

### 4. Promouvoir un utilisateur en MODERATOR
```sql
-- Remplacer 'email@example.com' par l'email de l'utilisateur
UPDATE User SET role = 'MODERATOR' WHERE email = 'email@example.com';
```

### 5. Vérifier le changement
```sql
SELECT id, username, email, role FROM User WHERE role = 'MODERATOR';
```

---

## Option 2: Créer un Nouveau Modérateur

### 1. S'inscrire normalement sur l'application
- Aller sur http://localhost:4200/register
- Créer un compte avec:
  - Username: `moderator`
  - Email: `moderator@fotoljay.com`
  - Password: `Moderator123!`

### 2. Promouvoir le compte via MySQL
```sql
USE fotoloujay;
UPDATE User SET role = 'MODERATOR' WHERE email = 'moderator@fotoljay.com';
```

---

## Option 3: Via Prisma Studio (Interface Graphique)

### 1. Lancer Prisma Studio
```bash
cd back_end
npx prisma studio
```

### 2. Dans le navigateur
- Ouvrir http://localhost:5555
- Cliquer sur "User"
- Trouver l'utilisateur à promouvoir
- Changer le champ "role" de "USER" à "MODERATOR"
- Cliquer sur "Save 1 change"

---

## 🎯 Tester le Compte Modérateur

### 1. Se connecter
- Aller sur http://localhost:4200/login
- Se connecter avec le compte modérateur

### 2. Vérifier les permissions
- ✅ Vous devriez voir le lien "Modération" dans la navbar
- ✅ Cliquer dessus pour accéder à la page de modération
- ✅ Vous devriez voir tous les produits en attente

### 3. Tester la modération
- Valider un produit → Il devrait apparaître sur la page d'accueil
- Rejeter un produit → Il devrait disparaître

---

## 📋 Rôles Disponibles

- `USER` - Utilisateur normal (par défaut)
- `VIP` - Utilisateur VIP (produits mis en avant)
- `MODERATOR` - Peut modérer les produits
- `ADMIN` - Accès complet (modération + admin)

---

## 🔐 Comptes de Test Suggérés

### Utilisateur Normal
```
Username: testuser
Email: user@test.com
Password: User123!
Role: USER
```

### Modérateur
```
Username: moderator
Email: moderator@test.com
Password: Moderator123!
Role: MODERATOR
```

### Admin
```
Username: admin
Email: admin@test.com
Password: Admin123!
Role: ADMIN
```

---

## 💡 Commande SQL Rapide

Pour créer directement un modérateur (après avoir créé le compte via l'interface):

```sql
-- Promouvoir en MODERATOR
UPDATE User SET role = 'MODERATOR' WHERE email = 'votre@email.com';

-- Promouvoir en ADMIN
UPDATE User SET role = 'ADMIN' WHERE email = 'votre@email.com';

-- Vérifier
SELECT username, email, role FROM User WHERE role IN ('MODERATOR', 'ADMIN');
```