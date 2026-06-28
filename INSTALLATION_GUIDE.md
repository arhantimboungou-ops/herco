# HERCO POS System - Installation & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/arhantimboungou-ops/herco.git
cd herco
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run web
# or for mobile
npm run android
npm run ios
```

## 🎯 Default Credentials

### Admin Account
- **Name**: Admin HERCO
- **PIN**: 1234
- **Role**: Administrator (Full access to dashboard)

### Cashier Account
- **Name**: Caissier 1
- **PIN**: 0001
- **Role**: Cashier (Payment processing)

### Server Account
- **Name**: Serveur 1
- **PIN**: 0002
- **Role**: Server (Table management)

## 📱 Features Overview

### For Cashiers
- Process payments (Cash, Card, Mobile Money)
- Calculate change automatically
- View order summaries
- Print receipts

### For Servers
- Manage restaurant tables
- Take orders from customers
- Send orders to kitchen
- Add special requests/notes
- Search products quickly

### For Administrators
- View real-time analytics
- Monitor revenue and sales
- Track popular items
- Analyze payment methods
- Generate reports

## 🛠️ Development

### Project Structure
```
herco/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens/pages
│   ├── theme/            # Design system
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utilities and constants
├── App_complete.js       # Main application file
├── package.json          # Dependencies
└── app.json              # Expo configuration
```

### Adding New Features

1. **Create a new component**
```bash
# Create in src/components/
# Export from src/components/index.js
```

2. **Create a new screen**
```bash
# Create in src/screens/
# Add to src/screens/index.js
# Import in App_complete.js
```

3. **Update theme**
```bash
# Edit src/theme/colors.js or typography.js
# Changes apply globally
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Build for web**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to Firebase Hosting

1. **Initialize Firebase**
```bash
firebase init hosting
```

2. **Build and deploy**
```bash
npm run build
firebase deploy
```

## 🔧 Configuration

### Change Currency
Edit `src/utils/constants.js`:
```javascript
export const formatFCFA = (amount) => {
  // Modify currency format here
};
```

### Add New Products
Edit `src/utils/constants.js`:
```javascript
export const DEFAULT_PRODUCTS = [
  { id: 1, catId: 1, name: 'Product Name', ... },
  // Add more products
];
```

### Add New Users
Edit `src/utils/constants.js`:
```javascript
export const DEFAULT_USERS = [
  { id: 1, name: 'User Name', pin: '1234', role: 'admin' },
  // Add more users
];
```

### Add New Tables
Edit `src/utils/constants.js`:
```javascript
export const DEFAULT_TABLES = [
  { id: 1, name: 'T01', zone: 'Salle', cap: 4 },
  // Add more tables
];
```

## 🎨 Customization

### Change Colors
Edit `src/theme/colors.js`:
```javascript
export const colors = {
  primary: '#1E40AF',        // Main brand color
  background: '#FFFFFF',     // Background
  surface: '#F8FAFC',        // Surface color
  // ... other colors
};
```

### Change Typography
Edit `src/theme/typography.js`:
```javascript
export const typography = {
  fontFamily: {
    base: 'Inter',           // Main font
    serif: 'Georgia',        // Serif font
  },
  // ... other settings
};
```

## 📊 Database Integration

Currently using mock data. To integrate with Supabase:

1. **Install Supabase client** (already in package.json)
```bash
npm install @supabase/supabase-js
```

2. **Create Supabase project**
- Visit https://supabase.com
- Create new project
- Get API keys

3. **Update constants.js**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_KEY'
);
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npm run web
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Clear Expo cache
expo start -c
```

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/arhantimboungou-ops/herco/issues
- Email: support@herco.app

## 📄 License

This project is proprietary software. All rights reserved.

---

**Version**: 1.0.0
**Last Updated**: 2026-06-28
**Status**: Production Ready ✅
