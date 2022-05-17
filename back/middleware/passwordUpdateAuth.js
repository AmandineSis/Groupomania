/******************************************************************************************** */
/**Authentification de la requête                                                             */
/******************************************************************************************** */

module.exports = (req, res, next) => {
    
    /**Le mot de passe doit contenir :
     * 1 caractère alphabetique en minuscule
     * 1 caractère alphabetique majuscule
     * 1 caractère numérique
     * 1 caractère spécial
     * minimum : 8 caractères
    */
    let validPswd = new RegExp(  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/);

    if (validPswd.test(req.body.password)) {
        next();
    }else{
        res.status(400).json({message : "Mot de passe invalide"})
    };
}