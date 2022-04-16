// routes.js

const router = require('express').Router();

const {body, checkSchema, validationResult} = require('express-validator');

const {loginPost,checkAuth, logout, registerPost, forget_password, new_password, new_password_post } = require('../controllers/auth_controller');

const {sendMessage, messages, messages_with, delete_message, block, blockList, unblock} = require('../controllers/chat_controller');

const {registerValidate, passwordValidate} = require('../middlewares/validation_middleware');
const {Authenticated, UnAuthenticated} = require('../middlewares/checkAuth');

//Login
router.post('/api/login-post',UnAuthenticated , loginPost);
//logout
router.post('/api/logout',Authenticated , logout);
//Register
router.post('/api/register-post',[checkSchema(registerValidate), UnAuthenticated,] , registerPost);

//Forget password
router.post('/api/forget-password/:email',UnAuthenticated , forget_password);
//New-password page when click link in mail
router.get('/api/new-password/:id/:token',UnAuthenticated, new_password );
//New-password
router.post('/api/new-password/:id/:token',[checkSchema(passwordValidate),UnAuthenticated], new_password_post );
//Check-auth
router.post('/api/check-auth', checkAuth);

//Message to the selected username
router.post('/api/message-to/:username', Authenticated, sendMessage)
//Messages
router.get('/api/messages', Authenticated, messages)
//Messages, to the selected username
router.get('/api/messages-with/:username', Authenticated, messages_with)
//Delete message, to the selected id
router.get('/api/delete-message/:id', Authenticated, delete_message)

//Block user, to the selected username
router.get('/api/block-to/:username', Authenticated, block)
//Block list
router.get('/api/unblock-to/:username', Authenticated, unblock)
//Unblock
router.get('/api/block-list/', Authenticated, blockList)



module.exports = router;