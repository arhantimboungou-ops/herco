# HERCO — Premium Point of Sale System

**HERCO** est un système de point de vente (POS) premium, hautement performant et entièrement animé, conçu pour les restaurants et bars haut de gamme. Développé avec **React Native** et **Expo**, il offre une expérience utilisateur fluide et professionnelle.

## ✨ Caractéristiques principales

### 🎨 Design Premium
- Interface moderne et épurée avec palette de couleurs premium (Slate + Amber)
- Animations fluides et transitions élégantes avec `react-native-reanimated`
- Composants réutilisables et cohérents
- Support responsive (téléphone, tablette, desktop)

### ⚡ Performance optimale
- Architecture modulaire et componentisée
- Utilisation de `FlashList` pour les listes haute performance
- Memoization des calculs complexes avec `useMemo`
- Gestion d'état optimisée
- Code splitting et lazy loading

### 📊 Fonctionnalités complètes
- **Authentification** : Connexion par PIN sécurisée
- **Tableau de bord** : KPIs en temps réel et statistiques
- **Système POS** : Gestion des commandes et du panier
- **Gestion des tables** : Suivi des réservations
- **Gestion des produits** : Catalogue avec catégories
- **Rapports** : Analyses de ventes et performances

### 🔐 Sécurité
- Authentification par rôle (Admin, Caissier, Serveur)
- Gestion des permissions
- Intégration Supabase prête pour la base de données

## 🚀 Installation

### Prérequis
- Node.js 16+ et npm/pnpm
- Expo CLI (`npm install -g expo-cli`)

### Étapes d'installation

```bash
# Cloner le dépôt
git clone https://github.com/arhantimboungou-ops/herco.git
cd herco

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm start

# Pour le web
pnpm web

# Pour Android
pnpm android

# Pour iOS
pnpm ios
```

## 📁 Structure du projet

```
herco/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── PremiumButton.js
│   │   ├── PremiumCard.js
│   │   ├── PremiumInput.js
│   │   └── KPICard.js
│   ├── screens/             # Écrans principaux
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   └── POSScreen.js
│   ├── theme/               # Configuration de thème
│   │   └── colors.js
│   ├── hooks/               # Hooks personnalisés
│   │   └── useAppState.js
│   ├── utils/               # Utilitaires
│   │   └── responsive.js
│   └── services/            # Services métier
│       ├── formatter.js
│       └── initialData.js
├── App.js                   # Point d'entrée principal
├── app.json                 # Configuration Expo
├── babel.config.js          # Configuration Babel
├── package.json             # Dépendances
└── README.md                # Documentation
```

## 🎯 Utilisation

### Connexion
1. Sélectionnez un utilisateur (Admin, Caissier, Serveur)
2. Entrez le PIN (4 chiffres)
3. Accédez au tableau de bord

### Créer une commande
1. Cliquez sur "Nouvelle commande"
2. Sélectionnez une catégorie de produits
3. Ajoutez des articles au panier
4. Procédez au paiement

### Gestion des tables
- Visualisez l'état de toutes les tables
- Marquez-les comme occupées/libres
- Associez des commandes aux tables

## 🔧 Configuration

### Thème
Modifiez les couleurs dans `src/theme/colors.js` :

```javascript
export const Colors = {
  primary: '#0F172A',
  accent: '#F59E0B',
  // ...
};
```

### Données initiales
Modifiez les produits, catégories et utilisateurs dans `src/services/initialData.js`.

## 📊 Performance

- **Rendu optimisé** : Utilisation de `FlashList` pour les listes de 1000+ éléments
- **Animations fluides** : 60 FPS avec `react-native-reanimated`
- **Memoization** : Évite les re-rendus inutiles
- **Bundle size** : ~2.5 MB (web)

## 🔌 Intégration Supabase

Pour connecter une base de données Supabase :

1. Créez un projet Supabase
2. Ajoutez vos clés dans un fichier `.env`
3. Configurez les tables dans `src/services/supabase.js`

## 📱 Déploiement

### Web (Vercel)
```bash
pnpm build:prod
# Déployer le dossier dist sur Vercel
```

### Mobile
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :
1. Fork le dépôt
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pusher vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Développé avec ❤️ pour les restaurateurs modernes.**
