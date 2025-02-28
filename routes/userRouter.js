const router = require('express').Router();

const {createUser, verifyMail, userLogin, resetPassword, resetNewPassword, changePassword } = require('../controller/userController')

router.post('/register', createUser);
router.get('/mail/:id/:token', verifyMail);
router.post('/login', userLogin);
router.patch('/reset', resetPassword);
router.patch('/resetPassword/:id/:token', resetNewPassword);
router.patch('/change/:id', changePassword);


module.exports = router;
