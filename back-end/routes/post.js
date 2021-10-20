const express = require('express');
const postCtrl = require('../controllers/post');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/*-- POST -- */
router.post('/', multer, postCtrl.setOnePost);
router.post('/:id/comments', multer, postCtrl.setOneComment);

/*-- GET -- */
router.get('/forum/:forum', postCtrl.getAllPostByForum);
router.get('/:id/comments/', postCtrl.getAllCommentsByPostId);
router.get('/:id', postCtrl.getOnePostById);

/*-- PUT --*/
router.put('/:id', multer, postCtrl.updateOnePostOrComment)

/*-- DELETE -- */
router.delete('/:id', postCtrl.deletePost);

module.exports = router;