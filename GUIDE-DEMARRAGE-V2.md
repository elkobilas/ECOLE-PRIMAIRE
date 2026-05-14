# 🚀 Guide de Démarrage Rapide - Application de Gestion Scolaire

**Version:** 2.0 - Complète et Fonctionnelle  
**Date:** 28 Novembre 2025  
**Statut:** ✅ Tous les modules opérationnels

---

## ⚡ Démarrage Rapide (30 secondes)

1. **Double-cliquez sur** `start-app.bat`
2. **Attendez** que le navigateur s'ouvre automatiquement
3. **Connectez-vous** avec : `admin` / `admin123`
4. **C'est tout !** 🎉

---

## 📋 Prérequis

- ✅ **Node.js** (version 14 ou supérieure)
- ✅ **Navigateur moderne** (Chrome, Firefox, Edge, Safari)
- ✅ **Port 8081** disponible

### Vérifier Node.js
```bash
node --version
# Devrait afficher : v14.x.x ou supérieur
```

---

## 🚀 Méthodes de Démarrage

### Méthode 1 : Script Automatique (⭐ Recommandé)

**Windows :**
```bash
# Double-cliquer sur :
start-app.bat

# Ou dans le terminal :
.\start-app.bat
```

**Ce que fait le script :**
- ✅ Démarre le serveur Node.js sur le port 8081
- ✅ Ouvre automatiquement http://localhost:8081/login.html
- ✅ Affiche les informations de connexion

### Méthode 2 : Démarrage Manuel

**Étape 1 - Démarrer le serveur :**
```bash
node server.js
```

**Vous devriez voir :**
```
🚀 Serveur démarré sur http://localhost:8081
📱 Application de gestion scolaire accessible !
🛑 Pour arrêter le serveur, appuyez sur Ctrl+C
```

**Étape 2 - Ouvrir le navigateur :**
- Allez sur : **http://localhost:8081/login.html**

---

## 🔐 Comptes de Test

### 👨‍💼 Administrateur (Accès complet)
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin123`
- **Permissions :** Toutes les fonctionnalités

### 👨‍🏫 Enseignant
- **Nom d'utilisateur :** `enseignant`
- **Mot de passe :** `enseignant123`
- **Permissions :** Gestion des notes et élèves

### 👔 Direction
- **Nom d'utilisateur :** `direction`
- **Mot de passe :** `direction123`
- **Permissions :** Vue d'ensemble et rapports

---

## 📱 Fonctionnalités Disponibles

### 1. 📊 Tableau de Bord
- Vue d'ensemble des statistiques
- Graphiques interactifs (Chart.js)
- Activités récentes
- Indicateurs clés

### 2. 👨‍🎓 Gestion des Élèves
- ✅ Liste complète avec recherche
- ✅ Ajout/Modification/Suppression
- ✅ Informations des parents
- ✅ Export CSV
- ✅ Actions en lot

### 3. 👨‍🏫 Gestion des Enseignants (✨ NOUVEAU)
- ✅ Interface complète
- ✅ Statistiques en temps réel
- ✅ Gestion des qualifications
- ✅ Assignation aux classes
- ✅ Export des données

### 4. 🏫 Gestion des Classes (✨ NOUVEAU)
- ✅ Affichage en grille visuelle
- ✅ Barres de progression d'occupation
- ✅ Gestion des niveaux (Maternelle → CM2)
- ✅ Assignation des enseignants
- ✅ Suivi des effectifs

### 5. 📝 Gestion des Évaluations (✨ NOUVEAU)
- ✅ Saisie des notes
- ✅ Graphiques de distribution
- ✅ Moyennes par matière
- ✅ Filtres avancés
- ✅ Système de couleurs (Rouge/Orange/Vert)

### 6. 📈 Rapports et Analyses
- ✅ Synthèse des élèves
- ✅ Analyse des notes
- ✅ Statistiques des classes
- ✅ Performance des enseignants
- ✅ Export global

### 7. 👤 Profil Utilisateur
- ✅ Modification des informations
- ✅ Changement de mot de passe
- ✅ Préférences

---

## 🎯 Premiers Pas

### 1. Connexion
1. Ouvrez http://localhost:8081/login.html
2. Entrez : `admin` / `admin123`
3. Cliquez sur "Se connecter"

### 2. Explorer le Tableau de Bord
- Consultez les statistiques
- Visualisez les graphiques
- Vérifiez les activités récentes

### 3. Tester les Modules
**Enseignants :**
- Cliquez sur "Enseignants" dans le menu
- Explorez la liste (2 enseignants par défaut)
- Testez "Ajouter un enseignant"

**Classes :**
- Cliquez sur "Classes"
- Visualisez les 8 classes en grille
- Observez les barres de progression

**Évaluations :**
- Cliquez sur "Évaluations"
- Consultez les graphiques
- Testez les filtres

---

## 🔧 Résolution des Problèmes

### ❌ Le serveur ne démarre pas

**Problème :** Port 8081 déjà utilisé
```bash
# Solution 1 : Trouver et arrêter le processus
netstat -ano | findstr :8081
taskkill /PID [numéro_du_processus] /F

# Solution 2 : Modifier le port dans server.js
# Changez : const PORT = 8081;
# En : const PORT = 8082;
```

**Problème :** Node.js non installé
```bash
# Téléchargez Node.js depuis :
https://nodejs.org/
```

### ❌ L'application ne se charge pas

**Solution 1 : Vider le cache**
- Appuyez sur `Ctrl + F5` (Windows/Linux)
- Ou `Cmd + Shift + R` (Mac)

**Solution 2 : Vérifier l'URL**
- URL correcte : `http://localhost:8081/login.html`
- Pas : `file:///...`

**Solution 3 : Console du navigateur**
- Appuyez sur `F12`
- Onglet "Console"
- Vérifiez les erreurs en rouge

### ❌ Problèmes d'authentification

**Réinitialiser le localStorage :**
1. Ouvrez la console (`F12`)
2. Tapez : `localStorage.clear()`
3. Appuyez sur `Entrée`
4. Rechargez la page (`F5`)

---

## 📊 Données de Démonstration

L'application inclut des données par défaut :

- **3 élèves** (Jean Dupont, Marie Martin, Pierre Durand)
- **2 enseignants** (Sophie Leroy, Michel Moreau)
- **8 classes** (Petite Section → CM2)
- **2 notes** (exemples)
- **6 matières** (Mathématiques, Français, etc.)
- **3 utilisateurs** (admin, enseignant, direction)

Ces données sont stockées dans le **localStorage** du navigateur.

---

## 📚 Documentation Complémentaire

- **README.md** - Documentation complète du projet
- **CORRECTIONS-FINALES.md** - Détails des corrections (28 Nov 2025)
- **TEST-STABILITE.md** - Guide de tests et vérifications
- **CORRECTIONS.md** - Historique des corrections précédentes

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé et vérifié
- [ ] Port 8081 disponible
- [ ] Serveur démarré avec succès
- [ ] Application ouverte dans le navigateur
- [ ] Connexion réussie avec admin/admin123
- [ ] Tableau de bord affiché correctement
- [ ] Toutes les sections testées
- [ ] Aucune erreur dans la console

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser l'application de gestion scolaire !

**Prochaines étapes :**
- Personnalisez les données
- Ajoutez vos propres élèves et enseignants
- Explorez toutes les fonctionnalités
- Générez vos premiers rapports

---

**Bon démarrage avec l'application de gestion scolaire ! 🎓📚✨**

*Pour toute question, consultez la documentation ou vérifiez la console du navigateur.*
