/******************************************************************************************** */
/**Création d'un schéma de données POST                                                       */
/******************************************************************************************** */
class Comment {
    constructor(userId, postId, content, imageUrl)
    {
        this.userId = userId,
        this.postId = postId,
        this.content = content,
        this.imageUrl = imageUrl
    }
  
}


/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = Comment;