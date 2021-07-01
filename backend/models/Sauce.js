const mongoose = require('mongoose');    // importation package mongoose pour faciliter interactions avec MongoDB

const sauceSchema = mongoose.Schema({    // Création d'un schéma de données pour les sauces 
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
  
});

module.exports = mongoose.model('Sauce', sauceSchema);  // Export du schéma en tant que modèle Mongoose pour le rendre disponible pour notre application Express 



