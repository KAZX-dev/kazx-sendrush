# SendRush

> Bouton « Envoyer » animé en HTML, CSS et JS : flèches ultra-rapides, validation façon Apple Pay (cercle et coche), erreur avec croix rouge et tremblement, retour haptique. Sans librairie.

Dépôt : `kazx-sendrush`

- Au clic, des flèches filent vers la droite avec des traînées de vitesse.
- Le bouton devient un rond, puis un cercle se trace autour d'une coche (succès) ou d'une croix (erreur).
- Succès : le rond saute et le téléphone vibre. Erreur : fond rouge, tremblement et vibration.
- Mode sombre automatique, animations réduites si l'appareil le demande.

## Contenu du projet

```
kazx-sendrush/
├── index.html   # la page et la structure du bouton
├── style.css    # les couleurs et toutes les animations
├── script.js    # la séquence d'animation, le haptique et l'envoi
├── README.md    # ce fichier
├── LICENSE      # © KΛZX.dev Tous droits réservés.
└── .gitignore   # fichiers à ne pas envoyer sur GitHub
```

## Tester en local

Ouvre simplement `index.html` dans ton navigateur. Coche « Simuler une erreur » pour voir l'animation d'erreur.

## Brancher ton vrai envoi

Dans `script.js`, la fonction `sendMessage()` est un faux envoi de 0,9 seconde. Remplace son contenu par ton `fetch` : si la promesse réussit, tu as la validation, si elle échoue, tu as l'erreur.

Pense aussi à supprimer la case « Simuler une erreur » dans `index.html`.

## Mettre le projet sur GitHub

### Avant de commencer

- Un compte sur [github.com](https://github.com)
- Git installé : [git-scm.com/downloads](https://git-scm.com/downloads) (vérifie avec `git --version`)

### 1. Créer le dépôt sur GitHub

1. Va sur [github.com/new](https://github.com/new).
2. Donne un nom, par exemple `kazx-sendrush`.
3. Choisis **Public** ou **Private**.
4. **Ne coche pas** « Add a README », « Add .gitignore » ni « Choose a license » : ils existent déjà dans le projet.
5. Clique sur **Create repository**.

### 2. Envoyer le code

Ouvre un terminal dans le dossier du projet et tape, en remplaçant `TON-PSEUDO` par ton nom d'utilisateur GitHub :

```bash
git init
git add .
git commit -m "Premier commit : SendRush"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/kazx-sendrush.git
git push -u origin main
```

Si GitHub te demande un mot de passe, utilise un [jeton d'accès personnel](https://github.com/settings/tokens) à la place, ou connecte-toi avec GitHub CLI (`gh auth login`).

### 3. Mettre le site en ligne (GitHub Pages)

1. Dans ton dépôt, va dans **Settings** puis **Pages**.
2. Dans **Source**, choisis **Deploy from a branch**.
3. Sélectionne la branche **main** et le dossier **/ (root)**, puis clique sur **Save**.
4. Après une minute environ, ton bouton est visible sur :
   `https://TON-PSEUDO.github.io/kazx-sendrush/`

GitHub Pages est gratuit pour les dépôts publics. Pour un dépôt privé, il faut un abonnement payant.

### 4. Mettre à jour plus tard

Après chaque modification :

```bash
git add .
git commit -m "Décris ici ce que tu as changé"
git push
```

## Licence

© KΛZX.dev Tous droits réservés.

Aucune autorisation d'utiliser, copier, modifier ou redistribuer ce code n'est accordée sans accord écrit préalable. Voir le fichier `LICENSE`.
