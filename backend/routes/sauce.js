const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // importation middleware d'authentification
const multer = require('../middleware/multer-config'); // importation middleware multer

const sauceCtrl = require('../controllers/sauce')           // Appel des controllers

router.get('/',auth, sauceCtrl.getAllSauces);               // Récupèration toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce);      // Création d'une sauce / avec requête multer pour gérer images
router.get('/:id',auth, sauceCtrl.getOneSauce);             // Récupération d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);    // Modification d'une sauce / avec requête multer pour gérer images
router.delete('/:id', auth, sauceCtrl.deleteSauce);         // Suppression d'une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);        // Gestion des likes sur une sauce donnée


module.exports = router;