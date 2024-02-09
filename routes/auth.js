const router = require('express').Router();
const controller = require('../controllers/auth.controller');

router.post('/signup', controller.signupUser);
router.post('/login', controller.loginUser);
router.get('/verify/:verificationCode', controller.verifyUser);
router.post('/forgot', controller.forgotUser);

module.exports = router;