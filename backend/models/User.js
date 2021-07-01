const mongoose = require('mongoose');                           // importation package mongoose pour faciliter interactions avec MongoDB
const uniqueValidator = require('mongoose-unique-validator');  // importation package mongoose unique validator pour garantir unicité emails

const userSchema = mongoose.Schema({    // Création d'un schéma de données pour les sauces 
  email: { type: String, required: true, unique: true }, //"unique" pour s'assurer que 2 users ne peuvent pas avoir la même adresse 
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On passe le package mongoose unique validator comme plugin

module.exports = mongoose.model('User', userSchema); // Export du schéma en tant que modèle Mongoose pour le rendre disponible pour notre application Express.
