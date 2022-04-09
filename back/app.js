/**************************************************************************************** */
/*********                   APPLICATION EXPRESS                                ********* */
/**************************************************************************************** */

const express = require('express'); 
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');


const app = express(); 
const path = require('path');
require('dotenv').config();
/******************************************************************************************** */
/**Connexion à la base de donnée Groupomania                                                      */
const db = require('./config/DBconnection');

/******************************************************************************************** */
/**CORS - Paramètrage des en-têtes                                                                                      */
/******************************************************************************************** */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    next();
  });

/******************************************************************************************** */
/**Mise à disposition du body des requêtes avec comme Content-type: application/json
/**  directement sur l'objet requête.
/******************************************************************************************** */
app.use(express.json()); 


/******************************************************************************************** */
/**Logique globale de l'application                                                           */
/******************************************************************************************** */

/**Gestion de la ressource Image de manière statique */
app.use('/images/user', express.static(path.join(__dirname, 'images/user'))); 
app.use('/images/post', express.static(path.join(__dirname, 'images/post'))); 
app.use('/images/comment', express.static(path.join(__dirname, 'images/comment'))); 

/**USERS */
app.use('/api/user', userRoutes);

/**POSTS */
app.use('/api/posts', postRoutes);


/******************************************************************************************** */
/**Exportation de l'application                                                               */
/******************************************************************************************** */
module.exports = app;