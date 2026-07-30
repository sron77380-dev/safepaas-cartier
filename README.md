# SafePass App

Application web de formation gamifiee pour agents de securite — Fondation Cartier.

Stack : Next.js 14 + TypeScript + Tailwind CSS + Supabase (Auth + PostgreSQL).

---

## Structure du projet

```
safepass-app/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── login/              # Page de connexion
│   │   ├── register/           # Page d inscription
│   │   ├── play/               # Mode jeu (Phase 2)
│   │   ├── dashboard/          # Dashboard manager (Phase 5)
│   │   ├── profile/            # Profil agent (Phase 4)
│   │   ├── notifications/      # Notifications agent (Phase 5)
│   │   ├── admin/              # Administration (Phase 6)
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Page d accueil
│   │   └── globals.css         # Styles globaux
│   ├── components/             # Composants React
│   ├── lib/
│   │   ├── supabase.ts         # Client Supabase (browser/server/admin)
│   │   ├── utils.ts            # Utilitaires (cn)
│   │   └── database.types.ts   # Types TypeScript Supabase
│   ├── types/
│   │   └── index.ts            # Types metier
│   └── middleware.ts           # Protection des routes + roles
├── supabase/
│   ├── schema.sql              # Schema complet BDD (8 tables)
│   └── seed.sql                # 120 questions (24 x 5 themes)
├── docker/
│   ├── Dockerfile              # Image Next.js production
│   └── nginx.conf              # Reverse proxy
├── docker-compose.yml          # Orchestration Docker
├── .env.example                # Variables d environnement
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Deploiement Vercel (Recommande)

Le moyen le plus rapide pour mettre SafePass en ligne.

### 1. Supabase (Base de donnees)

1. Va sur https://app.supabase.com
2. Clique **"New Project"**
3. Choisis ton org, nomme-le (ex: `safepass-mike`), region **Frankfurt (eu-central-1)**
4. Attends 2 min que ca demarre
5. Va dans **SQL Editor** (barre latérale)
6. Copie-colle `supabase/schema.sql` → Run
7. Copie-colle `supabase/seed.sql` → Run
8. Va dans **Project Settings > API**
9. Copie ces 2 valeurs :
   - `URL` (ex: `https://xxxx.supabase.co`)
   - `anon public` (cle qui commence par `eyJ...`)

### 2. GitHub (Code source)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/safepass-app.git
git push -u origin main
```

### 3. Vercel (Deploy)

1. Va sur https://vercel.com/new
2. Connecte ton compte GitHub
3. Selectionne le repo `safepass-app`
4. **Framework Preset** : Next.js (auto-detecte)

**Variables d'environnement** (clique "Add" pour chaque) :

| Nom | Valeur |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ton URL Supabase (etape 1) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ta cle anon Supabase (etape 1) |
| `NEXT_PUBLIC_APP_URL` | L'URL Vercel (ex: `https://safepass-app.vercel.app`) |

5. Clique **Deploy**
6. Attends 2-3 minutes

✅ Ton app est en ligne !

### 4. Premier compte Admin

Par defaut, tous les comptes ont le role **"agent"**. Pour creer un admin :

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'ton-email@exemple.com';
```

---

## Installation locale

### Prerequis

- Node.js 20+
- npm

### Commandes

```bash
git clone <repo>
cd safepass-app
npm install
```

Copier `.env.example` vers `.env.local` et remplir les variables Supabase.

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Schema BDD

| Table | Description |
|-------|-------------|
| `profiles` | Profils utilisateurs (agent/manager/admin) |
| `questions` | Banque de 120+ questions (5 themes) |
| `games` | Parties jouees |
| `game_answers` | Reponses detaillees par partie |
| `badges` | Badges debloques |
| `themes_stats` | Stats par theme par agent |
| `notifications` | Notifications manager → agents |
| `notification_reads` | Lecture des notifications |

---

## Auth & Roles

| Role | Acces |
|------|-------|
| `agent` | /play, /profile, /notifications |
| `manager` | + /dashboard, envoi notifications |
| `admin` | + /admin, CRUD questions, gestion agents |

---

## Themes de questions

- **SSIAP** — Securite incendie (ambre)
- **TFP** — Technique formation (vert)
- **APS** — Agent prevention securite (rouge)
- **SST** — Sauveteur secouriste (violet)
- **CARTIER** — Specifique Fondation Cartier (cyan)

---

## Branding

- **SafePass** — Le produit
- **SocialSticks** — L agence
- **Fondation Cartier** — Le client pilote
- Annee : 2025/2026

---

## Licence

Propriete exclusive SocialSticks / Ronnou Jean.
