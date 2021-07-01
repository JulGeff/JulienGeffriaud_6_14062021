const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);  // Création d'un compte user
router.post('/login', userCtrl.login);     // Connexion à un compte user

module.exports = router;  // export pour pouvoir utiliser dans app.js