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
/*         Implémentation de la logique métier             */
/***********************************************************/

//Récupération de tous les commentaires d'un post
exports.getAllComments = (req, res, next) => {
    let postId = req.params.postId; 
    let sql = 'SELECT * FROM `comments` JOIN users WHERE comments.postId =' + db.escape(postId) + ' AND comments.userId = users.userId ORDER BY comId ASC LIMIT 20; ';
    db.query(sql, postId, (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error })
        } else {
            let comExists = results[0];
            if (!comExists) {
                return res.json({ message: "aucun commentaire" });
            }
            return res.status(201).json({ results })
        }
    });

};

//création d'un commentaire
//req.body = {commentContent: string, imageUrl:string}
//req.token.userId
exports.createComment = (req, res, next) => {
    //Vérification des données de la requête
    const commentContent = (req.body.commentContent) ? req.body.commentContent : " ";
    const imageUrl = (req.file) ? `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}` : undefined;
    const postId = req.params.postId;
    //S'il n'y a pas de contenu ET pas d'image => erreur
    if (commentContent == "" && imageUrl == undefined) {
        return res.status(400).json({ message: "Ce post est vide, impossible d'accéder à la requête !" })
    }
    //création de l'objet post
    const comment = new Comment(
        req.token.userId,
        postId,
        commentContent,
        imageUrl,
    )
    //Ajout du nouveau post à la BDD
    let sql = 'INSERT INTO comments SET ?';
    db.query(sql, comment, (error, results, fields) => {
        if (error) throw ({ error });
            let sqlPost = 'UPDATE posts SET comments = comments + 1 WHERE postId =' + db.escape(postId);
            db.query(sqlPost, postId, (error, results, fields) => {
                if (error) throw ({ error });
                res.status(201).json({ message: "nouveau commentaire ajouté !" })
            });
    });
};

//modification d'un commentaire
//Either Comment as JSON OR { updatedComment:String,image: File }
//req.token.userId
//req.params.postId
//req.params.comId
//result = "commentaire modifié !"
exports.updateComment = (req, res, next) => {
    let imageUrl;
    let imageExists;
    let newImagePath;
    //Si envoi d'une nouvelle image => modification de l'URL de l'image
    if(req.file && !req.body.image){
        newImagePath= `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}`
        imageUrl = newImagePath;
    //Si envoi de l'image déjà présente dans la BDD => récupération de l'URL de l'image existante
    } else if (req.body.image && !req.file  ){
        imageUrl = req.body.image
        imageExists = true
    //Si pas d'image envoyée
    } else if (req.body.image && req.body.image == null && !req.file  ){
        imageUrl = null
    } else if (!req.file && !req.body.image || !req.file && req.body.image == null){
        imageUrl = null
    }
    
    const comId = req.params.comId;
    const userId = req.token.userId;
    //trouver le commentaire à modifier dans la base de données
    let sql = 'SELECT * FROM comments WHERE comId =' + db.escape(comId);
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let comExists = results[0];
        //si post n'existe pas => erreur
        if (!comExists) {
            return res.status(404).json({ message: "désolé ! aucun commentaire n'a été trouvé !" });
        }
        //si comExists.userId !== req.token.userId => utilisateur non authorisé
        if (comExists.userId !== userId && req.token.moderator == 0 ) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }
        //Récupération du contenu mis à jour
        let commentContent = (req.body.commentContent) ? req.body.commentContent : " ";
        
        //S'il n'y a pas de contenu ET pas d'image => erreur
        if (commentContent == " " && imageUrl == null) {
            return res.status(400).json({ message: "Veuillez ajouter un contenu !" })
        }

        const comment = new Comment(
            req.token.userId,
            comId,
            commentContent,
            imageUrl
        );

        if (comExists.imageUrl !== null && imageUrl == newImagePath) {
            ////récupération et suppression de l'image avant modification sur le serveur
            const filename = comExists.imageUrl.split('/comment/')[1];
            fs.unlink(`images/comment/${filename}`, () => {
                //mise à jour de la BDD
                let sqlUpdate = 'UPDATE comments SET commentContent = ?, imageUrl = ? WHERE comId =' + db.escape(comId);
                db.query(sqlUpdate, [comment.commentContent, comment.imageUrl], (error, results, fields) => {
                    if (error) throw ({ error });
                    console.log(results);
                    res.status(200).json({ message: "commentaire modifié !" })
                })
            });
        }else if (comExists.imageUrl !== null && imageExists){
            //récupération et suppression de l'image avant modification sur le serveur
            const filename = comExists.imageUrl.split('/comment/')[1];
            fs.unlink(`images/comment/${filename}`, () => {
                //mise à jour de la BDD
                let sqlUpdate = 'UPDATE comments SET commentContent = ?, imageUrl = ? WHERE comId =' + db.escape(comId);
                db.query(sqlUpdate, [comment.commentContent, comment.imageUrl], (error, results, fields) => {
                    if (error) throw ({ error });
                    console.log(results);
                    res.status(200).json({ message: "commentaire modifié !" })
                })
            });
        } else if (comExists.imageUrl == null && imageUrl == newImagePath){
            //mise à jour de la BDD
            let sqlUpdate = 'UPDATE comments SET commentContent = ?, imageUrl = ? WHERE comId =' + db.escape(comId);
            db.query(sqlUpdate, [comment.commentContent, comment.imageUrl], (error, results, fields) => {
                if (error) throw ({ error });
                console.log(results);
                res.status(200).json({ message: "commentaire modifié !" })
            })
        } else if (comExists.imageUrl == null && imageUrl == null){
            //mise à jour de la BDD
            let sqlUpdate = 'UPDATE comments SET commentContent = ?, imageUrl = ? WHERE comId =' + db.escape(comId);
            db.query(sqlUpdate, [comment.commentContent, comment.imageUrl], (error, results, fields) => {
                if (error) throw ({ error });
                console.log(results);
                res.status(200).json({ message: "commentaire modifié !" })
            })
        }
    });
};

//suppression d'un commentaire
//req.token.userId
//req.params.postId
//req.params.comId
//result = "post supprimé !"
exports.deleteComment = (req, res, next) => {
    const postId = req.params.postId;
    const comId = req.params.comId;
    const userId = req.token.userId;
    //trouver le commentaire à modifier dans la base de données
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
        }else{
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
    }
    });
};
