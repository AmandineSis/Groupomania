/******************************************************************************************** */
/**Configuration des routes USER                                                              */
/******************************************************************************************** */

const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-user');
const userCtrl = require('../controllers/user');

router.post('/signup',userAuth, multer, userCtrl.signup); //POST /api/user/signup
router.post('/login', userCtrl.login);   //POST /api/user/login
router.get('/:userId', auth, userCtrl.getUser);//GET /api/user/:userId
router.get('/', auth, userCtrl.getSearchResult);//GET /api/user/
router.put('/:userId', auth, userCtrl.updateUser);//PUT /api/user/:userId
router.put('/:userId/password', auth, userCtrl.updatePassword);//PUT /api/user/:userId
router.put('/:userId/profilePic', auth, multer, userCtrl.updateUserPicture);//PUT /api/user/:picId ==> endpoint à vérifier
router.delete('/:userId', auth, userCtrl.deleteUser);//DELETE /api/user/:userId



/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = router;