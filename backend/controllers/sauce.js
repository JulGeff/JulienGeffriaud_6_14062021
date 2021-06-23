const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
}



exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};



exports.likeSauce = (req, res, next) => {

    if (like === 1) { // Option like
        if (usersLiked.indexOf(req.body.userId) = -1) { //On vérifie que user ID non présent dans array usersLiked
        Sauce.updateOne(
            { _id: req.params.id }, 
            { $inc: { likes: 1 },   //likes variable non définie ???
            $push: { usersLiked: req.body.userId }, _id: req.params.id })

            .then(() => res.status(200).json({ message: "like sauce !" }))
            .catch(error => res.status(400).json({ error }))
        }

    } else if (like === -1) {      // Option dislike
        if (usersDisliked.indexOf(req.body.userId) = -1) { //On vérifie que user ID non présent dans array usersDisliked
        Sauce.updateOne(
            { _id: req.params.id }, 
            { $inc: { dislikes: 1 },   //dislikes variable non définie ???
            $push: { usersDisliked: req.body.userId }, _id: req.params.id })

            .then(() => res.status(200).json({ message: "dislike sauce !" }))
            .catch(error => res.status(400).json({ error }))
        }

    } else if (like === 0) {        // Option ni like ni dislike
    
            if (usersLiked.indexOf(req.body.userId) > -1) { //On vérifie si user ID présent dans array usersLiked
                Sauce.updateOne(           
                    { _id: req.params.id }, 
                    { $inc: { likes: -1 }, 
                    $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "sauce not liked anymore !" }))
                    .catch(error => res.status(400).json({ error }))

            } else  if (usersDisliked.indexOf(req.body.userId) > -1)  { //On vérifie si user ID présent dans array usersDisliked
                Sauce.updateOne(           
                    { _id: req.params.id }, 
                    { $inc: { dislikes: -1 }, 
                    $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "sauce not unliked anymore !" }))
                    .catch(error => res.status(400).json({ error }))
            } 
        }
};


/*Définit le statut
"j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce. 
Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. 
Si j'aime = -1, l'utilisateur n'aime pas la sauce.
L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, 
en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la
même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour
avec chaque "j'aime"*/