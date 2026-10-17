# Soukday - Customer Web Platform (Next.js 16 + TypeScript + Tailwind CSS)

Plateforme web e-commerce moderne de type **Instacart** pour l’écosystème **Soukday**.
Conçue pour mettre en valeur les **épiceries fines orientales**, les **boucheries 100% Halal locales** et l’**épicerie directe Soukday expédiée partout au Canada et aux États-Unis**.

---

## 🏗️ Structure de la Page d'Accueil

La page d'accueil suit l'architecture exacte convenue pour guider l'acheteur :

1. **Bannière Principale + Sélecteur d'Adresse** :
   - Champ d'adresse & code postal en temps réel (ex: `H4L 3M8`, `H3S 1R7`, `H1P 2Y7`, `H7V 2W1`).
   - Détermine immédiatement les magasins et boucheries qui desservent le client.
   - Raccourcis pour Montréal, Saint-Laurent, Saint-Léonard, Brossard, Laval, Terrebonne et Saint-Jérôme.

2. **Rayons & Catégories de Produits (Swipe horizontal)** :
   - Épicerie maghrébine, Viandes et volailles, Fruits & légumes, Boulangerie & pâtisserie, Plats cuisinés, Poissons, etc.
   - Filtre instantanément les produits et magasins.

3. **Épicerie Directe Soukday** :
   - Mise en avant des produits vendus directement par Soukday.
   - Message clair : **Expédié partout au Canada (10 provinces) et aux États-Unis éligibles**.
   - Défilement horizontal des sous-catégories : Couscous & Semoules, Conserves, Huiles & Vinaigres, Pâtes & Riz, Thés & Cafés, Épices, etc.

4. **Boucheries livrant chez vous** :
   - Affiche uniquement les boucheries qui livrent à l'adresse sélectionnée du client.
   - Si une seule est disponible, elle est affichée en exclusivité ; si plusieurs, défilement aisé.
   - Couvre : Boucherie Zakiya Montréal, Boucherie Zakiya Saint-Léonard, Boucherie Koutoubia, Boucherie Mamounia (Laval), Boucherie Melia Halal (Saint-Jérôme).

5. **Autres magasins disponibles** :
   - Supermarchés, marchés spécialisés et traiteurs (Marché Yasmine Montréal, Brossard, Terrebonne, Marché Daata, Marché Zerda).

6. **Produits Populaires & Recommandés** :
   - Sélection coup de cœur avec badges (Bestseller, 100% Halal, Recette Maison, Expédition Canada).
   - Ajout au panier direct (+ / -), calcul unitaire, indication claire de provenance (Épicerie Directe vs Boucherie locale).

7. **Panier Multi-Vendeurs** :
   - Tiroir coulissant (slide-over drawer) séparant automatiquement les articles selon leur mode d'expédition (Épicerie Soukday vs Boucherie locale).

---

## 🚀 Démarrage Rapide

### 1. Développement Local
```bash
cd soukday-web
npm install
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 2. Compilation de Production
```bash
npm run build
npm start
```

---

## 🔗 Connexion à GitHub (Push & Pull)

Pour lier ce dossier `soukday-web` à un nouveau dépôt GitHub dédié :

1. Créez un nouveau dépôt vide sur votre compte GitHub (ex: `https://github.com/econnectcity/soukday-web.git`).
2. Exécutez les commandes suivantes dans le dossier `soukday-web` :

```bash
git remote add origin https://github.com/econnectcity/soukday-web.git
git branch -M main
git push -u origin main
```

Pour les prochaines modifications :
```bash
git add .
git commit -m "Description de vos changements"
git push origin main
```

---

## 🌐 Déploiement en Ligne

### Option A : Déploiement Vercel (Recommandé en 1 clic pour Next.js)
1. Rendez-vous sur [https://vercel.com](https://vercel.com) et connectez votre compte GitHub.
2. Cliquez sur **Add New... > Project** et sélectionnez `soukday-web`.
3. Ajoutez la variable d'environnement :
   - `NEXT_PUBLIC_API_URL` = `https://admin.soukday.ca`
4. Cliquez sur **Deploy**. Chaque `git push origin main` mettra à jour votre site instantanément !

### Option B : Déploiement sur cPanel / VPS Node.js
1. Clonez le dépôt sur le serveur dans le répertoire de votre domaine (ex: `/home/waistwell/domains/soukday.ca/public_html`).
2. Créez une application Node.js via le gestionnaire cPanel (Node 20.x).
3. Exécutez :
   ```bash
   npm install
   npm run build
   npm start
   ```
