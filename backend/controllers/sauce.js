const Sauce = require('../models/Sauce'); // importation du modèle Mongoose :  Sauce
const fs = require('fs'); // importation du package file system de node, qui donne notamment accès aux fonctions permettant de supprimer les fichiers.


//Création d'une sauce
exports.createSauce = (req, res, next) => { 
    
    const sauceObject = JSON.parse(req.body.sauce); // extrait l'objet JSON
    delete sauceObject._id; // On enlève l'id
    const sauce = new Sauce({
        ...sauceObject,         // Opérateur Spread pour copie de tous les éléments de req.body.sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on récupère l'url de l'image
    });
    sauce.save()    // Enregistrement dans la base de données
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !' // Requête traitée avec succès et création d’un document.

        }))
        .catch(error => res.status(400).json({  //Bad Request
            error
        }));
}

//Modification d'une sauce
exports.modifySauce = (req, res, next) => { 
    const sauceObject = req.file ? // Si req.file existe
      {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On traite la nouvelle image
      } : { ...req.body };  // Sinon on traite l'objet entrant (sans image)
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Mise à jour de la sauce avec l'id passé en premier argument
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) // Requête traitée avec succès
      .catch(error => res.status(400).json({ error })); //Bad Request
  };


  // Suppression d'une sauce
  exports.deleteSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id }) //On récupère la sauce grâce à son id
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; //On utilise le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier 
        fs.unlink(`images/${filename}`, () => { // On utilise la fonction unlink du package fs pour supprimer ce fichier
            Sauce.deleteOne({ _id: req.params.id }) // callback : Suppression de la sauce avec l'id correspondant
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'})) // Requête traitée avec succès
            .catch(error => res.status(400).json({ error })); // Bad request
        });
      })
      .catch(error => res.status(500).json({ error })); // Internal Server Error	
  };


// Récupération d'une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({                 // Renvoir le Thing unique ayant le même _id que le paramètre de la requêt
            _id: req.params.id      // On récupère l'id de la sauce
        })
        .then(sauce => res.status(200).json(sauce))   // Sauce retournée dans une promise et envoyée au frontend
        .catch(error => res.status(404).json({        // Ressource non trouvée
            error
        }));
}


// Récupération de toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(        // renvoie un tableau contenant toutes les sauces dans notre base de données
        (sauces) => {         
            res.status(200).json(sauces); // Sauces retournées dans une promise et envoyée au frontend
        }
    ).catch(
        (error) => {
            res.status(400).json({      // Bad request
                error: error
            });
        }
    );
};


// Gestion des likes
exports.likeSauce = (req, res, next) => {

    const like = req.body.like;

    if (like === 1) { // Option like
        Sauce.updateOne(
            { _id: req.params.id },   //On récupère l'id de la sauce
            { $inc: { likes: + 1 },   //On incrémente les likes
            $push: { usersLiked: req.body.userId }, _id: req.params.id }) //On ajoute le userID du client à la fin du array usersLikes

            .then(() => res.status(200).json({ message: "like sauce !" })) // Requête traitée avec succès
            .catch(error => res.status(400).json({ error }))    // Bad request
        

    } else if (like === -1) {      // Option dislike
        Sauce.updateOne(
            { _id: req.params.id },      //On récupère l'id de la sauce
            { $inc: { dislikes: + 1 },   //On incrémente les dislikes
            $push: { usersDisliked: req.body.userId }, _id: req.params.id }) //On ajoute le userID du client à la fin du array usersDislikes

            .then(() => res.status(200).json({ message: "dislike sauce !" })) // Requête traitée avec succès
            .catch(error => res.status(400).json({ error }))    // Bad request
        

    } else {        // Option ni like ni dislike
            Sauce.findOne({    //On récupère l'id de la sauce
            _id: req.params.id // On récupère l'id de la sauce
            })
            .then(sauce => { 
                if (sauce.usersLiked.includes(req.body.userId)) { //On vérifie si user ID présent dans array usersLiked
                Sauce.updateOne(           
                    { _id: req.params.id }, //On récupère l'id de la sauce
                    { $inc: { likes: -1 },  //On décrémente les likes de la sauce
                    $pull: { usersLiked: req.body.userId }, _id: req.params.id }) //On supprime le userID du client du array usersLikes
                    .then(() => res.status(200).json({ message: "sauce not liked anymore !" })) // Requête traitée avec succès
                    .catch(error => res.status(400).json({ error })) } // Bad request

                if (sauce.usersDisliked.includes(req.body.userId)) { //On vérifie si user ID présent dans array usersDisliked
                Sauce.updateOne(           
                    { _id: req.params.id },   //On récupère l'id de la sauce
                    { $inc: { dislikes: -1 }, //On décrémente les dislikes de la sauce
                    $pull: { usersDisliked: req.body.userId }, _id: req.params.id }) //On supprime le userID du client du array usersDislikes
                    .then(() => res.status(200).json({ message: "sauce not unliked anymore !" })) // Requête traitée avec succès
                    .catch(error => res.status(400).json({ error }))  }     // Bad request
            })
            .catch(error => res.status(404).json({
                error
            }));
}};