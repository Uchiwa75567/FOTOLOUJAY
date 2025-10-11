# 🚀 Démarrage Rapide

## Étape 1 : Installer les dépendances

```bash
cd frontend-angular
npm install
```

⏱️ Cela peut prendre quelques minutes...

## Étape 2 : Démarrer le backend

Dans un terminal séparé :

```bash
cd back_end
npm run dev
```

✅ Le backend doit être accessible sur `http://localhost:3001`

## Étape 3 : Démarrer le frontend Angular

```bash
cd frontend-angular
npm start
```

✅ L'application sera accessible sur `http://localhost:4200`

## Étape 4 : Tester

1. Ouvrez `http://localhost:4200`
2. Cliquez sur "S'inscrire"
3. Créez un compte
4. Explorez le dashboard

## 🎉 C'est tout !

Pour plus de détails, consultez :
- `INSTRUCTIONS.md` - Guide complet
- `../MIGRATION_ANGULAR.md` - Vue d'ensemble de la migration

## ⚠️ Problèmes courants

### "ng: not found"
```bash
npm install
```

### "Cannot connect to API"
Vérifiez que le backend est lancé sur le port 3001

### Port 4200 déjà utilisé
Modifiez le port dans `angular.json` ou tuez le processus existant