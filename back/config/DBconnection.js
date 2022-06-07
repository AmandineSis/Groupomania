/******************************************************************************************** */
/**Configuration de la connexion à la BDD Groupomania                                         */
/******************************************************************************************** */

//Importation du module 'mysql'
const mysql = require('mysql');

//Paramètres de connexion à la base de donnée
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cEstduR0ot$kilnousfo",
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