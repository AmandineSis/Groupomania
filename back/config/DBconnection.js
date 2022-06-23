/******************************************************************************************** */
/**Configuration de la connexion à la BDD Groupomania                                         */
/******************************************************************************************** */

//Importation du module 'mysql'
const mysql = require('mysql');

//Paramètres de connexion à la base de donnée
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database : "groupomaniadb"
});

//connexion à la BDD
db.connect(function(err) {
    if (err) throw err;
    console.log('Connexion à groupomaniaDB réussie !')
});

/******************************************************************************************** */
/**Exportation du module de connexion                                                         */
/******************************************************************************************** */
module.exports = db;