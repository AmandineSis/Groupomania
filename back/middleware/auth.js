/******************************************************************************************** */
/**Authentification de la requête                                                             */
/******************************************************************************************** */

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //Ajout du token dans la requête
    req.token = jwt.verify(token, process.env.TOKEN_KEY);
    console.log('2testupdate back auth')
    if (req.body.userId && req.body.userId !== req.token.userId && req.body.userId !== 0) {
      throw 'Invalid user ID';
    } else {
      console.log('3testupdate back auth')
      next();
    }
  } catch {
    return res.status(401).json({ error:'mauvaise authentification!!'});
  }
};