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
    Sauce.findOne({ _id: req.params.id }) //On récupère l'id de la sauce
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
            _id: req.params.id      //On récupère l'id de la sauce
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

    const like = req.body.like;

    if (like === 1) { // Option like
        Sauce.updateOne(
            { _id: req.params.id },   //On récupère l'id de la sauce
            { $inc: { likes: + 1 },   //On incrémente les likes
            $push: { usersLiked: req.body.userId }, _id: req.params.id }) //On ajoute le userID du client à la fin du array usersLikes

            .then(() => res.status(200).json({ message: "like sauce !" }))
            .catch(error => res.status(400).json({ error }))
        

    } else if (like === -1) {      // Option dislike
        Sauce.updateOne(
            { _id: req.params.id },      //On récupère l'id de la sauce
            { $inc: { dislikes: + 1 },   //On incrémente les dislikes
            $push: { usersDisliked: req.body.userId }, _id: req.params.id }) //On ajoute le userID du client à la fin du array usersDislikes

            .then(() => res.status(200).json({ message: "dislike sauce !" }))
            .catch(error => res.status(400).json({ error }))
        

    } else {        // Option ni like ni dislike
            Sauce.findOne({    //On récupère l'id de la sauce
            _id: req.params.id // On récupère l'ID de la sauce
            })
            .then(sauce => { 
                if (sauce.usersLiked.includes(req.body.userId)) { //On vérifie si user ID présent dans array usersLiked
                Sauce.updateOne(           
                    { _id: req.params.id }, //On récupère l'id de la sauce
                    { $inc: { likes: -1 },  //On décrémente les likes de la sauce
                    $pull: { usersLiked: req.body.userId }, _id: req.params.id }) //On supprime le userID du client du array usersLikes
                    .then(() => res.status(200).json({ message: "sauce not liked anymore !" }))
                    .catch(error => res.status(400).json({ error })) }

                if (sauce.usersDisliked.includes(req.body.userId)) { //On vérifie si user ID présent dans array usersDisliked
                Sauce.updateOne(           
                    { _id: req.params.id },   //On récupère l'id de la sauce
                    { $inc: { dislikes: -1 }, //On décrémente les dislikes de la sauce
                    $pull: { usersDisliked: req.body.userId }, _id: req.params.id }) //On supprime le userID du client du array usersDislikes
                    .then(() => res.status(200).json({ message: "sauce not unliked anymore !" }))
                    .catch(error => res.status(400).json({ error }))  }
            })
            .catch(error => res.status(404).json({
                error
            }));
}};