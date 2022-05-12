/******************************************************************************************** */
/**Configuration des routes POST                                                              */
/******************************************************************************************** */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-post');
const multerCom = require('../middleware/multer-com');
const postCtrl = require('../controllers/post');
const comCtrl = require('../controllers/comment');

router.get('/', auth, postCtrl.getPostsByDate); //GET /api/posts
router.get('/famous', auth, postCtrl.getPostsByLike); //GET /api/posts/famous
router.get('/:userId', auth, postCtrl.getUserPostsByDate); //GET /api/posts/:userId
router.get('/:userId/famous', auth, postCtrl.getUserPostsByLike); //GET /api/posts/:userId/famous
router.post('/', auth, multer, postCtrl.createPost);//POST /api/posts
router.put('/:postId', auth, multer, postCtrl.updatePost);//PUT /api/posts/:postId
router.delete('/:postId', auth, postCtrl.deletePost);//DELETE /api/posts/:postId
router.post('/:postId/like', auth, postCtrl.likePost);//POST /api/posts/:postId/like
router.post('/:postId/report', auth, postCtrl.reportPost);//POST /api/posts/:postId/report

router.get('/:postId/comment', auth, comCtrl.getAllComments); //GET /api/comments
router.post('/:postId/comment', auth, multerCom, comCtrl.createComment);//POST /api/posts
router.put('/:postId/:comId', auth, multerCom, comCtrl.updateComment);//PUT /api/comments/:comId
router.delete('/:postId/:comId', auth, comCtrl.deleteComment);//DELETE /api/posts/:postId


/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = router;