# CLAUDE.md

Ce fichier fournit le contexte du projet pour Claude Code lorsqu'il travaille sur ce dépôt.

## Aperçu du projet

**Atelier Venta Nails** — Application web initialisée avec React, Vite et Tailwind CSS.

## Stack technique

- **React 19** — bibliothèque UI
- **Vite 8** — outil de build et serveur de développement
- **Tailwind CSS v4** — framework CSS utilitaire (intégré via `@tailwindcss/vite`)
- **ESLint** — linter JavaScript / React

## Commandes utiles

| Commande | Description |
| --- | --- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Démarre le serveur de développement (HMR) |
| `npm run build` | Construit l'application pour la production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Exécute ESLint sur le projet |

## Structure du projet

```
.
├── public/              # Fichiers statiques (favicon, icônes)
├── src/
│   ├── App.jsx          # Composant racine
│   ├── main.jsx         # Point d'entrée React
│   └── index.css        # CSS global (importe Tailwind)
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite (plugin React + Tailwind)
├── eslint.config.js     # Configuration ESLint
└── package.json
```

## Tailwind CSS

Tailwind v4 est configuré via le plugin officiel Vite. Aucun fichier `tailwind.config.js` n'est requis — la configuration se fait directement dans `src/index.css` avec la directive `@import "tailwindcss"` et, si besoin, des règles `@theme` pour personnaliser le thème.

## Conventions

- Composants React en `.jsx`
- Modules ES (`"type": "module"` dans `package.json`)
- Styling via classes Tailwind plutôt que CSS dédié
