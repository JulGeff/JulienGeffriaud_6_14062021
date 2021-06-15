const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sauce = require('./models/Sauce');
const User = require('./models/User');

const app = express();


mongoose.connect('mongodb+srv://geffswayze:gAcYjhD9Z4Kws2T@cluster0.2rxvh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());


app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
      ...req.body
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.post('/api/auth/signup', (req, res, next) => {
    delete req.body._id;
    const user = new User({
      ...req.body
    });
    user.save()
      .then(() => res.status(201).json({ message: 'User enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });



module.exports = app;