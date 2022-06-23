/******************************************************************************************** */
/**User controller                                                                            */
/******************************************************************************************** */

/*********************************************************************/
/**Importation du schéma user et des modules bcrypt et jsonwebtoken  */
/******************************************************************* */

const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const db = require('../config/DBconnection');
const fs = require('fs');
require('dotenv').config();


/***********************************************************/
/**Implémentation de la logique métier                     */
/********************************************************* */

//Enregistrement du nouvel utilisateur
//req.body = { firstName: string, lastName: string, email: string, password: string, imageUrl: string }
//results = "utilisateur créé !"
exports.signup = (req, res, next) => {
  //Recherche si le user existe dans la base de données
  let sql = 'SELECT * FROM users WHERE email= ?';
  db.query(sql, [req.body.email], (error, results, fields) => {
    if (error) throw ({ error });
    let user = results[0];
    //si user existe => erreur "user already exists"
    if (user) {
      return res.status(401).json({ message: "désolé, cet utilisateur existe déjà !",  });
      //sinon crypter le mot de passe avec bcrypt et ajouter l'utilisateur à la BDD
    } else {
      //hachage du mot de passe 
      bcrypt.hash(req.body.password, 10)
        .then(hash => {

          //Création du nouvel utilisateur 
          const profilePic = `${req.protocol}://${req.get('host')}/images/user/profilePicDefault.jpg`;

          const user = new User(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            hash,
            profilePic,
            0
          );
          //Si tous les champs user ne sont pas remplis => erreur
          if (user.firstName == "" || user.lastName == "" || user.email == "" || user.password == "" ){
            return res.status(400).json({ message : "Tous les champs n'ont pas été remplis !"})
          }
          
          //Ajout du nouvel utilisateur à la BDD
          let sql = 'INSERT INTO users SET ?';
          db.query(sql, user, (error, results, fields) => {
            if (error) {
              res.status(500).json({ error })
            } else {
              res.status(201).json({ message: "utilisateur créé !" })
            }
          });
        })
        .catch(err => res.status(500).json({ message: "erreur création nouvel utilisateur" }));
    }
  })

};

//login
//req.body = { email: string, password: string }
//result = { userId: string, token: string }
exports.login = (req, res) => {

  //trouver le user dans la base de données
  let sql = 'SELECT * FROM users WHERE email= ?';
  db.query(sql, [req.body.email], (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.status(404).json({ message: "désolé ! l'utilisateur n'existe pas" });
      //sinon comparer le mot de passe avec bcrypt et créer un token d'authentification    
    } else {
      bcrypt.compare(req.body.password, userExists.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //création du token d'authentification
          let token = jwt.sign({ userId: userExists.userId, moderator: userExists.moderator }, process.env.TOKEN_KEY, { expiresIn: '24h' });
          res.status(200).json({ userId: userExists.userId, token, moderator: userExists.moderator});
        })
        .catch(error => res.status(500).json({ error }));
    }
  });
};

//récupération du compte utilisateur//onclick sur photo de profile
//req.params.userId
//req.token
//results = données de l'utilisateur défini par le userId de la requête
exports.getUser = (req, res) => {

  //trouver le user dans la base de données
  let sql = 'SELECT * FROM users WHERE userId= ?';
  db.query(sql, [req.params.userId], (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.json({ message: "désolé ! l'utilisateur n'existe pas" });
      //sinon comparer le mot de passe avec bcrypt et créer un token d'authentification    
    } else {
      res.status(200).json({ results });
    }
  });
};

//récupération du compte utilisateur
//req.body.indexName
//req.token
//results = données de l'utilisateur défini par le userId de la requête
exports.getSearchResult = (req, res) => {
  console.log(req.body.indexName);
  //trouver le user dans la base de données
  let sql = `SELECT * FROM users WHERE firstName LIKE '%${req.body.indexName}%' OR lastName LIKE '%${req.body.indexName}%' LIMIT 10`;
  db.query(sql, [req.body.indexName], (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.json({ message: "désolé ! l'utilisateur n'existe pas" });
      //sinon envoi des résultats 
    } else {
      res.status(200).json({ results });
    }
  });
};

//modification du compte utilisateur
//req.body = { firstName: string, lastName: string, email: string}
//req.token.userId = int,
//req.params.userId = string
//result = "utilisateur modifié !"
exports.updateUser = (req, res) => {

  //trouver le user dans la base de données
  const userId = parseInt(req.params.userId);
  let sql = 'SELECT * FROM users WHERE userId='+ db.escape(userId);
  db.query(sql, (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.json({ message: "désolé ! l'utilisateur n'existe pas" });
    } else {
      //si userId !== req.token.userId => utilisateur non authorisé
      if (userId !== req.token.userId) {
        return res.status(401).json({ message: "utilisateur non authorisé !" });
      }
      let sql = 'SELECT * FROM users WHERE email= ?';
      db.query(sql, [req.body.email], (error, results, fields) => {
        if (error) throw ({ error });
        let userEmailExists = results[0];
        console.log(userEmailExists)
        //si user existe => erreur "user already exists"
        if (userEmailExists && userEmailExists.email !== userExists.email) {
          return res.status(401).json({ message: "désolé, cet email existe déjà !",  });
        //sinon crypter le mot de passe avec bcrypt et ajouter l'utilisateur à la BDD
      } else {
        //mise à jour de la BDD
        const user = new User(
          req.body.firstName,
          req.body.lastName,
          req.body.email
        );
        let sqlUpdate = 'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE userId =' + db.escape(userId);
        db.query(sqlUpdate, [user.firstName, user.lastName, user.email], (error, results, fields) => {
          if (error) throw ({ error });
          console.log(results);
          res.status(200).json({ message: "utilisateur modifié !" })
        })
    }
  });
}})};

//modification du mot de passe
//req.body = { oldPswd: string, newPswd: string}
//req.token
//result = "Mot de passe modifié !"
exports.updatePassword = (req, res) => {
  console.log('update password---->'+req.body);
  console.log(req.body.password);
  //trouver le user dans la base de données
  const userId = parseInt(req.params.userId);
  let sql = 'SELECT * FROM users WHERE userId= ?';

  db.query(sql, userId, (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.status(404).json({ message: "désolé ! l'utilisateur n'existe pas" });
    } else {
      //si userId !== req.token.userId => utilisateur non authorisé
      if (userId !== req.token.userId) {
        return res.status(401).json({ message: "utilisateur non authorisé !" });
      }
      //Vérification de l'ancien mot de passe
      bcrypt.compare(req.body.oldPswd, userExists.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //si ancien mot de passe authorisé, hachage du nouveau mot de passe et mise à jour de la BDD
          bcrypt.hash(req.body.newPswd, 10)
            .then(hash => {
              const password = hash;
              let sqlUpdate = 'UPDATE users SET password = ? WHERE userId =' + db.escape(userId);
              db.query(sqlUpdate, password, (error, results, fields) => {
                if (error) throw ({ error });
                console.log(results);
                res.status(200).json({ message: "mot de passe modifié !" })
              })
            })
            .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
    }
  });
};

//modification de la photo de profile
//req.body = { image: File }
//req.token
//result = "Photo de profil modifiée !"
exports.updateUserPicture = (req, res) => {
  //trouver le user dans la base de données
  const userId = parseInt(req.params.userId);
  console.log(userId);
  let sql = 'SELECT * FROM users WHERE userId='+ db.escape(userId);
  db.query(sql, (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    console.log(userExists);
    //si user n'existe pas => erreur
    if (!userExists) {
      res.status(404).json({ message: "désolé ! l'utilisateur n'existe pas" });
    } else {
        //si userId !== req.token.userId => utilisateur non authorisé
        if (userId !== req.token.userId) {
          return res.status(401).json({ message: "utilisateur non authorisé !" });
        }

        const defaultPic = `${req.protocol}://${req.get('host')}/images/user/profilePicDefault.jpg`;
        if (userExists.profilePicUrl !== defaultPic) {
        //récupération et suppression de l'image enregistée avant modification sur le serveur
        const filename = userExists.profilePicUrl.split('/user/')[1];
        fs.unlink(`images/user/${filename}`, () => {
              //mise à jour de la BDD
              profilePicUrl = `${req.protocol}://${req.get('host')}/images/user/${req.file.filename}`;
              let sqlUpdate = 'UPDATE users SET profilePicUrl = ? WHERE userId =' + db.escape(userId);
              db.query(sqlUpdate, [profilePicUrl], (error, results, fields) => {
                if (error) throw ({ error });
                console.log(results);
                res.status(200).json({ message: "Photo de profil modifiée !" })
              })
          });
        }else{
            //mise à jour de la BDD
            profilePicUrl = `${req.protocol}://${req.get('host')}/images/user/${req.file.filename}`;
            let sqlUpdate = 'UPDATE users SET profilePicUrl = ? WHERE userId =' + db.escape(userId);
            db.query(sqlUpdate, [profilePicUrl], (error, results, fields) => {
              if (error) throw ({ error });
              console.log(results);
              res.status(200).json({ message: "Photo de profil modifiée !" })
            })
        }
    }
  });
};

//suppression du compte utilisateur
//req.token
//req.data={password: string}
//result = "utilisateur supprimé !"
exports.deleteUser = (req, res) => {
  //trouver le user dans la base de données
  const userId = parseInt(req.params.userId);
  let sql = 'SELECT * FROM users WHERE userId= ?';
  
  db.query(sql, userId, (error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.status(404).json({ message: "désolé ! l'utilisateur n'existe pas" });
    //sinon si user existe...
    } else {

      //si user existe && userId !== req.token.userId => utilisateur non authorisé
      if (userId !== req.token.userId && req.token.moderator == 0) {
        return res.status(401).json({ message: "utilisateur non authorisé !" });
      } 

      //Vérification de l'ancien mot de passe
      bcrypt.compare(req.body.password, userExists.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //si mot de passe autorisé, récupération et suppression de l'image 
          //avant suppression si image !== image par défaut
          const defaultPic = `${req.protocol}://${req.get('host')}/images/user/profilePicDefault.jpg`;
          let sqlDelete = 'DELETE FROM users WHERE userId =' + db.escape(userId);
          
          if (userExists.profilePicUrl !== defaultPic) {
            const filename = userExists.profilePicUrl.split('/user/')[1];
            fs.unlink(`images/user/${filename}`, () => {
              //mise à jour de la BDD
              db.query(sqlDelete, (error, results, fields) => {
                if (error) throw ({ error });
                res.status(200).json({ message: "utilisateur supprimé !" })
              });
            })
          } else {
            //mise à jour de la BDD
            db.query(sqlDelete, (error, results, fields) => {
              if (error) throw ({ error });
              //add BDD update cascade delete comments and likes on POSTS related to userId
              res.status(200).json({ message: "utilisateur supprimé !" })
            });
          }
        })
        .catch(error => res.status(500).json({ error }))
      }}
  );
};

//suppression du compte utilisateur
//req.token
//req.data={password: string}
//result = "utilisateur supprimé !"
exports.moderatorDeleteUser = (req, res) => {
  //trouver le user dans la base de données
  const userId = parseInt(req.params.userId);
  const moderatorId = parseInt(req.params.moderatorId);

  let sql = 'SELECT * FROM users WHERE userId=' + db.escape(userId);
  
  db.query(sql,(error, results, fields) => {
    if (error) throw ({ error });
    const userExists = results[0];
    //si user n'existe pas => erreur
    if (!userExists) {
      res.status(404).json({ message: "désolé ! l'utilisateur n'existe pas" });
    //sinon si user existe...
    } else {

      //si user existe && userId !== req.token.userId => utilisateur non authorisé
      if (moderatorId !== req.token.userId) {
        return res.status(401).json({ message: "utilisateur non authorisé !" });
      } 

      let sqlMod = 'SELECT * FROM users WHERE userId=' + db.escape(moderatorId);
      db.query(sqlMod,(error, results, fields) => {
        if (error) throw ({ error });
        const modExist = results[0];
        //Vérification de l'ancien mot de passe
        bcrypt.compare(req.body.password, modExist.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //si mot de passe autorisé, récupération et suppression de l'image 
            //avant suppression si image !== image par défaut
            const defaultPic = `${req.protocol}://${req.get('host')}/images/user/profilePicDefault.jpg`;
            let sqlDelete = 'DELETE FROM users WHERE userId =' + db.escape(userId);

            if (userExists.profilePicUrl !== defaultPic) {
              const filename = userExists.profilePicUrl.split('/user/')[1];
              fs.unlink(`images/user/${filename}`, () => {
                //mise à jour de la BDD
                db.query(sqlDelete, (error, results, fields) => {
                  if (error) throw ({ error });
                  res.status(200).json({ message: "utilisateur supprimé !" })
                });
              })
            } else {
              //mise à jour de la BDD
              db.query(sqlDelete, (error, results, fields) => {
                if (error) throw ({ error });
                //add BDD update cascade delete comments and likes on POSTS related to userId
                res.status(200).json({ message: "utilisateur supprimé !" })
              });
            }
          })
          .catch(error => res.status(500).json({ error }))
          })}})
};