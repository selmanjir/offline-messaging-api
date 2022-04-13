// routes.js

const router = require('express').Router();

const {body, checkSchema, validationResult} = require('express-validator');

const {login, loginPost, logout, register, registerPost } = require('../controllers/auth_controller');

const {registerValidate, passwordValidate, loginValidate} = require('../middlewares/validation_middleware');
const {checkAuth} = require('../middlewares/checkAuth');

router.get('/login',checkAuth , login);
router.post('/login-post',checkAuth , loginPost);
router.post('/logout',checkAuth , logout);


router.get('/register',checkAuth , register);
router.post('/register-post',[checkSchema(registerValidate), checkAuth,] , registerPost);

module.exports = router;