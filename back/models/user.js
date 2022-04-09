/******************************************************************************************** */
/**Création d'un schéma de données USER                                                       */
/******************************************************************************************** */


/**
 * firstName = string
 * lastName = string
 * email = string
 * password = string
 * profilePicUrl = string
 * moderator = boolean
 */
class User {
    constructor(firstName, lastName, email, password, profilePicUrl, moderator)
    {
        this.firstName = firstName,
        this.lastName = lastName,
        this.email = email,
        this.password = password,
        this.profilePicUrl = profilePicUrl,
        this.moderator = moderator
    }
}

/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = User;