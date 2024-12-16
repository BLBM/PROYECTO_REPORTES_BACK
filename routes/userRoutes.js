const express = require('express');
const {createUserPost} = require('../controllers/usersController');
const router = express.Router();


router.post('/reportes/createUser' , createUserPost);


module.exports = router;