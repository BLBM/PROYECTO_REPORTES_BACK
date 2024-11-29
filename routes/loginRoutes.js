const express = require('express');
const {login} = require('../controllers/loginController');
const router = express.Router();


router.post('/reportes/login' , login);


module.exports = router;