/******************************************************************************************** */
/**COMMENTS CONTROLLER                                                                          */
/******************************************************************************************** */

/***********************************************************/
/**Importation du schéma POST et du module fs de node.js  */
/********************************************************* */

const Comment = require("../models/comment");
const db = require('../config/DBconnection');
const fs = require('fs');
require('dotenv').config();

/***********************************************************/
/**Implémentation de la logique métier                     */
/***********************************************************/

//Récupération de tous les commentaires
exports.getAllComments = (req, res, next) => {
    //let sql = 'SELECT * FROM comments ORDER BY comId ASC LIMIT 20';
    let sql = 'SELECT * FROM `comments` JOIN posts WHERE comments.postId = posts.postId ORDER BY comId ASC LIMIT 20';
    db.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            let comExists = results[0];
            if (!comExists) {
                res.json({ message: "aucun commentaire" });
            }
            res.status(201).json({ results })
        }
    });

};

//création d'un commentaire
//req.body = {comment: string, imageUrl:string}
//req.token.userId
exports.createComment = (req, res, next) => {
    //Vérification des données de la requête
    const content = (req.body.content) ? req.body.content : " ";
    const imageUrl = (req.file) ? `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}` : "";
    const postId = req.params.postId;
    //S'il n'y a pas de contenu ET pas d'image => erreur
    if (content == "" && imageUrl == "") {
        return res.status(400).json({ message: "Ce post est vide, impossible d'accéder à la requête !" })
    }

    //création de l'objet post
    const comment = new Comment(
        req.token.userId,
        postId,
        content,
        imageUrl,
    )
    //Ajout du nouveau post à la BDD
    let sql = 'INSERT INTO comments SET ?';
    db.query(sql, [comment], (error, results, fields) => {
        if (error) throw ({ error });
            let sqlPost = 'UPDATE posts SET comments = comments + 1 WHERE postId =' + db.escape(postId);

            db.query(sqlPost, postId, (error, results, fields) => {
                if (error) throw ({ error });
                res.status(201).json({ message: "nouveau commentaire ajouté !" })
            });
        
    });
};

//modification d'un commentaire
//Either Post as JSON OR { post:String,image: File }
//req.token.userId
//req.params.postId
//req.params.comId
//result = "commentaire modifié !"
exports.updateComment = (req, res, next) => {
    //trouver le commentaire à modifier dans la base de données
    const postId = req.params.postId;
    const comId = req.params.comId;
    const userId = req.token.userId;
    let sql = 'SELECT * FROM comments WHERE comId =' + db.escape(comId);
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let comExists = results[0];
        //si post n'existe pas => erreur
        if (!comExists) {
            return res.status(404).json({ message: "désolé ! aucun commentaire n'a été trouvé !" });
        }
        //si post.userId !== req.token.userId => utilisateur non authorisé
        if (comExists.userId !== userId) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }

        let content = (req.body.content) ? req.body.content : " ";
        let imageUrl = (req.file) ? `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}` : " ";
        
        //S'il n'y a pas de contenu ET pas d'image => erreur
        if (content == " " && imageUrl == " ") {
            return res.status(400).json({ message: "Veuillez ajouter un contenu !" })
        }
        ////récupération et suppression de l'image avant modification sur le serveur
        if (comExists.imageUrl !== " ") {
            const filename = comExists.imageUrl.split('/comment/')[1];
            fs.unlink(`images/comment/${filename}`, (error) => {
                if (error) throw ({ error });
            });
        }
        //mise à jour de la BDD
        const comment = new Comment(
            req.token.userId,
            postId,
            content,
            imageUrl
        );
        let sqlUpdate = 'UPDATE comments SET ? WHERE comId =' + db.escape(comId);
        db.query(sqlUpdate, [comment], (error, results, fields) => {
            if (error) throw ({ error });
            console.log(results);
            res.status(200).json({ message: "commentaire modifié !" })
        })
    });
};

//suppression d'un commentaire
//req.token.userId
//req.params.postId
//req.params.comId
//result = "post supprimé !"
exports.deleteComment = (req, res, next) => {
   //trouver le commentaire à modifier dans la base de données
   const postId = req.params.postId;
   const comId = req.params.comId;
   const userId = req.token.userId;
   let sql = 'SELECT * FROM comments WHERE comId =' + db.escape(comId);
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let comExists = results[0];
        //si post n'existe pas => erreur
        if (!comExists) {
            return res.status(404).json({ message: "désolé ! aucun commentaire n'a été trouvé !" });
        }
        //si post.userId !== req.token.userId => utilisateur non authorisé
        if (comExists.userId !== userId && req.token.moderator == 0) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }
        //récupération et suppression de l'image avant modification sur le serveur s'il y en a une
        if (comExists.imageUrl !== null) {
            const filename = comExists.imageUrl.split('/comment/')[1];
            fs.unlink(`images/comment/${filename}`, (error) => {
                if (error) throw ({ error });
            });
        }
        //mise à jour de la BDD
        let sqlDelete = 'DELETE FROM comments WHERE comId =' + db.escape(comId);
        db.query(sqlDelete, (error, results, fields) => {
            if (error) throw ({ error });
            let sqlPost = 'UPDATE posts SET comments = comments - 1 WHERE postId =' + db.escape(postId);

            db.query(sqlPost, (error, results, fields) => {
                if (error) throw ({ error });
                res.status(201).json({ message: "commentaire supprimé !" })
            });
        });
    });
};
