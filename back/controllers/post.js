/******************************************************************************************** */
/**POSTS CONTROLLER                                                                          */
/******************************************************************************************** */

/***********************************************************/
/**Importation du schéma POST et du module fs de node.js  */
/********************************************************* */

const Post = require("../models/post");
const db = require('../config/DBconnection');
const fs = require('fs');
require('dotenv').config();


/***********************************************************/
/**Implémentation de la logique métier                     */
/***********************************************************/

//Récupération de tous les posts
//results = tous les posts du plus récent au plus ancien (max 20)
exports.getPostsByDate = (req, res, next) => {
    let sql = 'SELECT * FROM posts JOIN users WHERE posts.userId=users.userId ORDER BY created DESC LIMIT 20';
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let post = results[0];
        if (!post) {
            return res.json({ message: "aucun post" });
        }else{
            return res.status(201).json({ results })
        }
    });
};

//Récupération de tous les posts
//results = tous les posts du plus récent au plus ancien (max 20)
exports.getPostsByLike = (req, res, next) => {
    let sql = 'SELECT * FROM posts JOIN users WHERE posts.userId=users.userId ORDER BY likes DESC LIMIT 20';
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let post = results[0];
        if (!post) {
            return  res.json({ message: "aucun post" });
        }else{
            return res.status(201).json({ results })
        }
    });
};


//Récupération de tous les posts
//results = tous les posts du plus récent au plus ancien (max 20)
exports.getReportedPosts = (req, res, next) => {
    let sql = 'SELECT * FROM posts JOIN users WHERE posts.userId=users.userId AND posts.report>=1 ORDER BY created DESC LIMIT 20';
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let post = results[0];
        if (!post) {
            res.json({ message: "aucun post" });
        }else{
        res.status(201).json({ results })
        }    
    });
};


//Récupération des posts par utilisateur
//req.params.userId
//results = tous les posts d'un utilisateur du plus récent au plus ancien (max 20)
exports.getUserPostsByDate = (req, res, next) => {
    const userId = req.params.userId;
    let sql = 'SELECT * FROM posts JOIN users ON posts.userId= users.userId WHERE posts.userId=? ORDER BY created DESC LIMIT 20; '
    db.query(sql, userId, (error, results, fields) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            let post = results[0];
            //Si post n'existe pas => erreur
            if (!post) {
                return res.json({ message: "aucun post n'a été trouvé" });
            }
            res.status(201).json({ results })
        }
    });
};

//req.params.userId
//results = tous les posts d'un utilisateur du plus populaire au moins populaire (max 20)
exports.getUserPostsByLike = (req, res, next) => {
    const userId = req.params.userId;
    let sql = 'SELECT * FROM posts JOIN users ON posts.userId= users.userId WHERE posts.userId=? ORDER BY likes DESC LIMIT 20;'
    db.query(sql, userId, (error, results, fields) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            let post = results[0];
            //Si post n'existe pas => erreur
            if (!post) {
                return res.json({ message: "aucun post n'a été trouvé" });
            }
            res.status(201).json({ results })
        }
    });
};

//création d'un post
//req.body = { content: String, imageUrl: File }
//req.token.userId
//result = "nouveau post créé !"
exports.createPost = (req, res, next) => {
    //Vérification des données de la requête
    const content = (req.body.content) ? req.body.content : " ";
    const imageUrl = (req.file) ? `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}` : undefined;
    
    //S'il n'y a pas de contenu ET pas d'image => erreur
    if (content == "" && imageUrl == undefined) {
        return res.status(400).json({ message: "Ce post est vide, impossible d'accéder à la requête !" })
    }

    //création de l'objet post
    const post = new Post(
        req.token.userId,
        content,
        imageUrl,
    )
    //Ajout du nouveau post à la BDD
    let sql = 'INSERT INTO posts SET ?';
    db.query(sql, post, (error, results, fields) => {
        if (error) throw ({ error });
        res.status(201).json({ message: "nouveau post ajouté !" })
    });
};

//modification d'un post
//Either Post as JSON OR { post:String,image: File }
//req.token.userId
//Modification table like et table comment
//result = "post modifié !"
exports.updatePost = (req, res, next) => {
    let imageUrl;
    let imageExists;
    let newImagePath
    //Si envoi d'une nouvelle image => modification de l'URL de l'image
    if(req.file && !req.body.image){
        newImagePath= `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`
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
    const postId = req.params.postId;
    //trouver le post à modifier dans la base de données
    let sql = 'SELECT * FROM posts WHERE postId =' + db.escape(postId);
    db.query(sql, (error, results, fields) => {
        if (error) throw ({ error });
        let postExists = results[0];
        //si post n'existe pas => erreur
        if (!postExists) {
            return res.status(404).json({ message: "désolé ! aucun post n'a été trouvé !" });
        }
        //si post.userId !== req.token.userId => utilisateur non authorisé
        if (postExists.userId !== req.token.userId && req.token.moderator == 0) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }
        //Récupération du contenu mis à jour
        let content = (req.body.content) ? req.body.content : " ";
        
        //S'il n'y a pas de contenu ET pas d'image => erreur
        if (content == " " && imageUrl == null) {
            return res.status(400).json({ message: "Veuillez ajouter un contenu !" })
        }
        
        const post = new Post(
            req.token.userId,
            content,
            imageUrl
        );
        let sqlUpdate = 'UPDATE posts SET content = ?, imageUrl = ?, comments = 0, likes =0 WHERE postId =' + db.escape(postId);
        let sqlLike = 'DELETE FROM likes WHERE postId =' + db.escape(postId);
        let sqlCom = 'DELETE FROM comments WHERE postId =' + db.escape(postId);

        if (postExists.imageUrl !== null && imageUrl == newImagePath) {
            ////récupération et suppression de l'image avant modification sur le serveur
            const filename = postExists.imageUrl.split('/post/')[1];
            fs.unlink(`images/post/${filename}`, () => {
                //mise à jour de la BDD
                db.query(sqlUpdate, [post.content, post.imageUrl], (error, results, fields) => {
                    if (error) throw ({ error });
                    db.query(sqlLike, (error, results, fields) => {
                        if (error) throw ({ error });
                        db.query(sqlCom, (error, results, fields) => {
                            if (error) throw ({ error });
                            res.status(200).json({ message: "post modifié !" });
                        });
                    });
                })
            });
        } else {
                db.query(sqlUpdate, [post.content, post.imageUrl], (error, results, fields) => {
                    if (error) throw ({ error });
                    db.query(sqlLike, (error, results, fields) => {
                        if (error) throw ({ error });
                        db.query(sqlCom, (error, results, fields) => {
                            if (error) throw ({ error });
                            res.status(200).json({ message: "post modifié !" });
                        });
                    });
                })
        }

})};

//suppression d'un post
//req.token.userId
//req.params.postId
//result = "post supprimé !"
exports.deletePost = (req, res, next) => {
    //trouver le post à modifier dans la base de données
    const postId = req.params.postId;
    let sql = 'SELECT * FROM posts WHERE postId =' + db.escape(postId);
    db.query(sql, postId, (error, results, fields) => {
        if (error) throw ({ error });
        let postExists = results[0];
        //si post n'existe pas => erreur
        if (!postExists) {
            return res.status(404).json({ message: "désolé ! aucun post n'a été trouvé !" });
        }
        //si post.userId !== req.token.userId => utilisateur non authorisé
        if (postExists.userId !== req.token.userId && req.token.moderator == 0) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }
        //récupération et suppression de l'image avant modification sur le serveur s'il y en a une
        if (postExists.imageUrl !== null) {
            const filename = postExists.imageUrl.split('/post/')[1];
            fs.unlink(`images/post/${filename}`, () => {
                //mise à jour de la BDD
                let sqlDelete = 'DELETE FROM posts WHERE postId =' + db.escape(postId);
                db.query(sqlDelete, (error, results, fields) => {
                    if (error) throw ({ error });
                    res.status(200).json({ message: "post supprimé !" })
                });
            });
        }else{
            //mise à jour de la BDD
            let sqlDelete = 'DELETE FROM posts WHERE postId =' + db.escape(postId);
            db.query(sqlDelete, (error, results, fields) => {
                if (error) throw ({ error });
                res.status(200).json({ message: "post supprimé !" })
            });
        }
        
    });
};

//like d'un post
//req.body { userId: string, like: INT(0/1)}
//req.params.postId
//req.token.userId
exports.likePost = (req, res, next) => {
    let postId = req.params.postId;
    let userId = req.token.userId;

    let sql = 'SELECT * FROM likes WHERE postId = ? AND userId = ?';
    db.query(sql, [postId, userId], (error, results, fields) => {

        if (error) throw ({ error });
        let postLiked = results[0];

        //si req.body.userId !== req.token.userId => utilisateur non authorisé
        if (req.body.userId !== userId) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }

        if (req.body.like == 1 && !postLiked) {
            let sqlPost = 'UPDATE posts SET likes = likes + 1 WHERE postId =' + db.escape(postId);

            db.query(sqlPost, postId, (error, results, fields) => {
                if (error) throw ({ error });
                let sqlLike = 'INSERT INTO likes SET userId = ?, postId = ?';
                db.query(sqlLike, [userId, postId], (error, results, fields) => {
                    if (error) throw ({ error });
                    res.status(200).json({ message: "Vous aimez ce post !" });

                });
            });
        } else if (req.body.like == 1 && postLiked) {
            let sqlPost = 'UPDATE posts SET likes = likes - 1 WHERE postId =' + db.escape(postId);
            db.query(sqlPost, postId, (error, results, fields) => {
                if (error) throw ({ error });
                let sqlLike = 'DELETE FROM likes WHERE likeId =' + db.escape(postLiked.likeId);
                db.query(sqlLike, (error, results, fields) => {
                    if (error) throw ({ error });
                    res.status(200).json({ message: "Vous n'aimez plus ce post !" });
                });
            });
        } else {
            res.status(500).json({ message: "erreur like !" })
        }
    });
};

//report d'un post
//req.body { userId: string, report: INT(0/1)}
//req.params.postId
//req.token.userId
exports.reportPost = (req, res, next) => {
    let postId = req.params.postId;
    let userId = req.token.userId;

    let sql = 'SELECT * FROM report WHERE postId = ? AND userId = ?';
    db.query(sql, [postId, userId], (error, results, fields) => {

        if (error) throw ({ error });
        let postReported = results[0];
        console.log(postReported);

        //si req.body.userId !== req.token.userId => utilisateur non authorisé
        if (req.body.userId !== userId) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }

        if (req.body.report == 1 && !postReported) {
            let sqlPost = 'UPDATE posts SET report = report + 1 WHERE postId =' + db.escape(postId);

            db.query(sqlPost, postId, (error, results, fields) => {
                if (error) throw ({ error });
                let sqlReport = 'INSERT INTO report SET userId = ?, postId = ?';
                db.query(sqlReport, [userId, postId], (error, results, fields) => {
                    if (error) throw ({ error });
                    res.status(200).json({ message: "Vous signalez ce post !" });

                });
            });
        } else if (req.body.report == 1 && postReported) {
            res.status(200).json({ message: "post déjà signalé" });
        } else {
            res.status(500).json({ message: "erreur report !" })
        }
    });
};

//suppression du signalement
//req.params.postId
//req.token.userId
exports.removeReport = (req, res, next) => {
    let postId = req.params.postId;
    let userId = req.token.userId;

    let sql = 'SELECT * FROM report WHERE postId = ?';
    db.query(sql, postId, (error, results, fields) => {

        if (error) throw ({ error });
        let postReported = results[0];
        //si req.body.userId !== req.token.userId => utilisateur non authorisé
        if (req.token.moderator !== 1 ) {
            return res.status(401).json({ message: "utilisateur non authorisé !" });
        }
        //Si postReported existe, suppression du signalement du post
        if ( postReported) {
            let sqlDeleteReport = 'DELETE FROM report WHERE reportId =' + db.escape(postReported.reportId);
            db.query(sqlDeleteReport, (error, results, fields) => {
                    if (error) throw ({ error });
                    let sqlPost = 'UPDATE posts SET report = 0 WHERE postId =' + db.escape(postId);
                    db.query(sqlPost, postId, (error, results, fields) => {
                        if (error) throw ({ error });
                        return res.status(200).json({ message: "post mis à jour!" });
                });
            });
        } else {
            return res.status(500).json({ message: "erreur report !" })
        }
                });

};