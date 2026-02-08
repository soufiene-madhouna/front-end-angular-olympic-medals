# Olympic Games - Application de visualisation

Une application web simple pour voir les statistiques des Jeux Olympiques avec des graphiques colorés.

Angular 18.0.3

---

## C'est quoi ce projet ?

Cette application affiche :
- Un graphique en camembert avec les médailles de chaque pays
- Les détails d'un pays quand on clique dessus
- Des statistiques (nombre de JO, nombre de pays, etc.)

---

##  Comment lancer le projet ?

### Étape 1 : Télécharger le code
```bash
git https://github.com/soufiene-madhouna/front-end-angular-olympic-medals
cd front-end-angular-olympic-medals
```

### Étape 2 : Installer les dépendances
```bash
npm install
```

>  Cela peut prendre quelques minutes la première fois

### Étape 3 : Lancer l'application
```bash
npm start
```

### Étape 4 : Ouvrir dans le navigateur

Allez sur : **http://localhost:4200**

🎉 **C'est tout !** L'application est lancée.

---

## Structure du projet (simplifié)
```
olympic-games-dashboard/
│
├── src/app/
│   ├── pages/
│   │   ├── home/           ← Page d'accueil avec le graphique
│   │   └── country/        ← Page de détail d'un pays
│   │
│   ├── services/           ← Code pour récupérer les données
│   └── models/             ← Définition des types de données
│
├── src/assets/mock/
│   └── olympic.json        ← Données des Jeux Olympiques
│
└── package.json            ← Liste des dépendances
```

---

## Ce que vous devez avoir installé

Avant de commencer, installez :

1. **Node.js** (version 18 ou plus récente)
   - Télécharger ici : https://nodejs.org/
   - Vérifier : `node --version`

2. **npm** (installé automatiquement avec Node.js)
   - Vérifier : `npm --version`

3. **Angular CLI**
   - Installer : `npm install -g @angular/cli`
   - Vérifier : `ng version`

---

## Commandes utiles
```bash
# Lancer l'application
npm start

# Arrêter l'application
Ctrl + C (dans le terminal)

# Installer une nouvelle dépendance
npm install nom-du-package

# Créer un build de production
npm run build
```

---

##  Comment ça marche ?

### Page d'accueil
1. Vous voyez un graphique avec tous les pays
2. Cliquez sur un pays pour voir ses détails

### Page détail
1. Vous voyez les statistiques du pays
2. Cliquez sur "Back" pour revenir à l'accueil

---

## Technologies utilisées

- **Angular** : Framework pour créer l'application
- **TypeScript** : Langage de programmation (comme JavaScript mais avec des types)
- **Chart.js** : Bibliothèque pour créer les graphiques
- **SCSS** : Pour les styles (CSS amélioré)

---

##  Fichiers importants

| Fichier | Description |
|---------|-------------|
| `src/app/pages/home/` | Code de la page d'accueil |
| `src/app/pages/country/` | Code de la page détail pays |
| `src/app/services/olympic.service.ts` | Récupère les données |
| `src/assets/mock/olympic.json` | Données des JO |
| `package.json` | Liste des dépendances du projet |

---

## Problèmes fréquents

### L'application ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
npm start
```

### Port 4200 déjà utilisé
```bash
# Lancer sur un autre port
ng serve --port 4300
```

### Erreur "ng: command not found"
```bash
# Installer Angular CLI
npm install -g @angular/cli
```

---

## 🆘 Besoin d'aide ?

- **Documentation Angular** : https://angular.io/docs
- **Documentation Chart.js** : https://www.chartjs.org/docs/
- **Tutoriel TypeScript** : https://www.typescriptlang.org/docs/

---

## 📝 Pour aller plus loin

Si vous voulez comprendre l'architecture du projet en détail, consultez :
👉 [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ✅ Checklist pour débutant

- [ ] J'ai installé Node.js
- [ ] J'ai installé Angular CLI
- [ ] J'ai cloné le projet
- [ ] J'ai fait `npm install`
- [ ] J'ai lancé `npm start`
- [ ] L'application s'ouvre sur http://localhost:4200
- [ ] Je peux cliquer sur les pays

Si tout est coché, bravo ! 
---

## 👤 Auteur

**Votre MADHOUNA**
- Email : souf_madhouna@yahoo.fr

---

**Fait avec ❤️ et Angular**