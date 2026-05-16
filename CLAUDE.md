# CLAUDE.md

Ce fichier fournit le contexte du projet pour Claude Code lorsqu'il travaille sur ce dépôt.

## Aperçu du projet

**L'Atelier Venta'Nails** — site vitrine + réservation pour Céline, prothésiste ongulaire à Ventabren (13).
Clientèle locale, ton élégant et chaleureux.

## Stack technique

- **React 19 + Vite 8** — framework et outil de build
- **Tailwind CSS v4** — styling utilitaire (via `@tailwindcss/vite`)
- **Supabase** — base de données + storage (bucket `photos-ongles`) + Auth
- **Vercel** — déploiement automatique sur push `main`
- **Resend** — emails de confirmation de réservation
- **ESLint** — linter

## Pages publiques

1. **Accueil** — hero, accroche, CTA réservation
2. **Prestations & Tarifs** — données depuis table Supabase `prestations`
3. **Galerie** — photos depuis bucket Supabase `photos-ongles`
4. **Réservation** — formulaire → insert table `reservations` + email Resend
5. **À propos** — texte fixe + photo de Céline
6. **Contact** — adresse Ventabren, téléphone, Instagram

## Espace admin (protégé Supabase Auth)

- Upload / suppression photos galerie
- Gestion des réservations (confirmer / annuler)
- Gestion des prestations et tarifs

## Charte graphique

- **Ton** : élégant, épuré, féminin, chaleureux
- **Palette** : nude, rose poudré, doré
- **Mobile-first** obligatoire
- **Polices** :
  - *Cormorant Garamond* pour les titres
  - *Inter* pour le texte courant

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
│   ├── lib/
│   │   └── supabase.js  # Client Supabase
│   ├── App.jsx          # Composant racine
│   ├── main.jsx         # Point d'entrée React
│   └── index.css        # CSS global (importe Tailwind)
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite (plugin React + Tailwind)
├── eslint.config.js     # Configuration ESLint
├── .env.local           # Variables d'environnement (NON commité)
└── package.json
```

## Variables d'environnement

Définies dans `.env.local` (ignoré par git) :

- `VITE_SUPABASE_URL` — URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` — clé publique anon Supabase

À ajouter plus tard : variables Resend côté serveur (route API ou edge function).

## Tailwind CSS

Tailwind v4 est configuré via le plugin officiel Vite. Pas de `tailwind.config.js` —
la configuration se fait directement dans `src/index.css` :

- `@import "tailwindcss"` pour activer Tailwind
- Bloc `@theme` pour personnaliser la palette, les polices, etc.

## Règles du projet (IMPORTANT)

- **Jamais** committer `.env.local` (déjà ignoré via `*.local`)
- SQL uniquement via le dashboard Supabase — pas de migrations en code
- Push sur `main` = déploiement automatique Vercel
- **Un module à la fois**, validé avec Céline / le client avant de passer au suivant
- **Toujours committer et pusher** après chaque module terminé
- Settings Claude Code locaux (`.claude/settings.local.json`) ignorés par git

## Conventions

- Composants React en `.jsx`
- Modules ES (`"type": "module"` dans `package.json`)
- Styling via classes Tailwind plutôt que CSS dédié
- Imports Supabase via `import { supabase } from './lib/supabase'`
