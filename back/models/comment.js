/******************************************************************************************** */
/**Création d'un schéma de données POST                                                       */
/******************************************************************************************** */
class Comment {
    constructor(userId, postId, commentContent, imageUrl)
    {
        this.userId = userId,
        this.postId = postId,
        this.commentContent = commentContent,
        this.imageUrl = imageUrl
    }
}

/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = Comment;