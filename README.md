Groupomania - Réseau social d'entreprise
- Compétences évaluées :

    Authentifier un utilisateur et maintenir sa session
    Personnaliser le contenu envoyé à un client web
    Gérer un stockage de données à l'aide de SQL
    Implémenter un stockage de données sécurisé en utilisant SQL

INSTALLATION
Prérequis :

Il vous faut avoir installé sur votre machine :

    Git : https://git-scm.com/downloads
    Node.js : https://nodejs.org/en/
    MySql : https://dev.mysql.com/downloads/installer/

Initialiser un dossier Git puis cloner ce repo à l'intérieur :

git clone https://github.com/AmandineSis/Groupomania.git

BACK END
Le backend a été crée avec Node.js, Express.js et MySQL comme base de données. 


MySQL

Dans le fichier groupomania/backend/.env ,mettre le mot de passe d'accès à votre base de donnée et votre nom d'utilisateur si besoin (root par défaut)

DB_USER=root
DB_PASS=

Ouvrir MySql command Line client puis effectuer ces deux lignes de commandes :

CREATE DATABASE groupomaniadb;
USE groupomaniadb;

Importer le fichier groupomaniadb.sql (qui ce trouve a la racine du projet) en entrant la ligne de commande suivante:

source (chemin vers le fichier groupomaniadb.sql);

---> Attention a indiquer le chemin avec des "/" et non des "\ ".

Ouvrir un terminal dans le dossier backend puis effectuer les lignes de commandes suivantes :

npm install
nodemon server

FRONT END
Le frontend a été réalisé avec Vue.js

Ouvrir un autre terminal dans le dossier frontend puis effectuer les lignes de commandes suivantes :

npm install
npm run serve

Ouvrir le navigateur a l'adresse http://localhost:8080/
Fonctionnalités :

Le site permet de

    Partager des posts (avec ou sans photos)
    modifier, supprimer ou signaler des posts
    Commenter et liker des posts
    modifier ou supprimer des commentaires
    Personnaliser son compte (modification des données utilisateurs/photo de profil)
    rechercher des utilisateurs
    supprimer son compte

Un compte admin est présent pour la modération:
    
    suppression/modification des posts/commentaires d'autres utilisateurs
    gestion des signalement de post
    suppression de compte utilisateur
    
Voici les codes d'accès admin :

admin@groupomania.com
Admin123!
