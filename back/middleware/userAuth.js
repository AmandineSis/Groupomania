/******************************************************************************************** */
/**Validation des données utilisateur                                                            */
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
    let validName = new RegExp( /^([a-zA-ZÀ-ÿ]{2,20}(['|\s|-]{1}[a-zA-ZÀ-ÿ]{0,20})*)$/);
    let validEmail = new RegExp( /^[a-z0-9]+([_|\.|-]{1}[a-zA0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$/);

    const email = req.body.email.toLowerCase();

    if ( (validName.test(req.body.firstName)) && (validName.test(req.body.lastName)) && (validEmail.test(email)) && (validPswd.test(req.body.password))) {
        next();
    }else{
        res.status(400).json({message : "Données saisies invalides"})
    }
};