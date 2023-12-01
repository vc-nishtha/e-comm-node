const router = require('express').Router();
const controller = require('../controllers/auth.controller');

router.post('/signup', controller.signupUser);
router.post('/login', controller.loginUser);
router.get('/verify/:verificationCode', controller.verifyUser);

module.exports = router;