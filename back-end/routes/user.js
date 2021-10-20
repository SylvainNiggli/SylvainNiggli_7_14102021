const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* -- POST -- */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/* -- GET -- */
router.get('/users', userCtrl.getAllUsers);

/* -- PUT -- */
router.put('/users/:id', multer, userCtrl.modifyUser);
/* -- DELETE -- */
router.delete('/users/:id', userCtrl.deleteUser);

module.exports = router;