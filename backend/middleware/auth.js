const jwt = require('jsonwebtoken');  // importation package pour création et vérification des tokens
require('dotenv').config()            // importation dotenv pour sécuriser passwords
const TokenKey = process.env.TOKENKEY;// Récupération de la clé de cryptage des tokens via dotenv


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // On extrait le token du header Authorization de la requête entrante. On récupère la partie située après 'Bearer '
    const decodedToken = jwt.verify(token, TokenKey); // On utilise la fonction verify de jsonwebtoken pour décoder notre token
    const userId = decodedToken.userId; // on extrait le user id de notre token
    if (req.body.userId && req.body.userId !== userId) { // On compare le user ID de la demande avec celui du token décodé
      throw 'Invalid user ID';  // Si users id différents on génère une erreur
    } else {
      next();  // Si users id identiques, on passe l'exécution
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};