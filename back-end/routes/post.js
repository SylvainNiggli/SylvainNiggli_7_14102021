const express = require('express');
const postCtrl = require('../controllers/post');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/*-- POST -- */
router.post('/',auth, multer, postCtrl.setOnePost);
router.post('/:id/comments',auth, multer, postCtrl.setOneComment);

/*-- GET -- */
router.get('/forum/:forum',auth, postCtrl.getAllPostByForum);
router.get('/:id/comments/',auth, postCtrl.getAllCommentsByPostId);
router.get('/:id',auth, postCtrl.getOnePostById);

/*-- PUT --*/
router.put('/:id',auth, multer, postCtrl.updateOnePostOrComment)

/*-- DELETE -- */
router.delete('/:id',auth, postCtrl.deletePost);

module.exports = router;