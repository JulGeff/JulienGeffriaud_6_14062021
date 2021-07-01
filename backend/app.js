const express = require('express');         // importation application Express
require('dotenv').config()                  // importation dotenv pour sécuriser passwords
const mongodb = process.env.MONGODB;        // Sécurisation infos MongoDB via dotenv
const bodyParser = require('body-parser');  // importation fonction body parser pour extraction objet json de la demande
const mongoose = require('mongoose');       // importation package mongoose pour faciliter interactions avec MongoDB
const path = require('path');               // permet d'accéder au path du serveur
const cors = require('cors');               // module CORS


const sauceRoutes = require('./routes/sauce'); // Importation routeur sauces
const userRoutes = require('./routes/user');   // Importation routeur users


mongoose.connect(mongodb,   //Connexion à la base de données MongoDB
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();  // application Express
app.use(cors())         // module CORS

app.use((req, res, next) => {  // Ajout headers pour résoudre les erreurs CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer des requêtes avec les méthodes mentionnées 
    next();
  });


app.use(bodyParser.json()); // Enregistrement body parser
app.use('/images', express.static(path.join(__dirname, 'images'))); // indique à Express qu'il faut gérer la ressource images de manière statique


app.use('/api/sauces', sauceRoutes);  // Enregistrement routeur sauces
app.use('/api/auth', userRoutes)      // Enregistrement routeur users





module.exports = app;