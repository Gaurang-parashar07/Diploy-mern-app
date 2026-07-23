const { sign } = require('jsonwebtoken');
const { signup } = require('../Controllers/AuthController');
const { login } = require('../Controllers/AuthController');
const { loginValidation } = require('../Middleware/AuthValidation');
const { signupValidation } = require('../Middleware/AuthValidation');




const router = require('express').Router();


router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;
