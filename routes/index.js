const express = require('express');
const router = require('express').Router();
const auth = require('./auth');
const product = require('./product');
const cart = require('./cart');
const authJWT = require('../middlewares/jwt.auth');

router.use('/auth', auth);
router.use('/product', authJWT.authToken, product);
router.use('/cart', authJWT.authToken, cart);
module.exports = router;