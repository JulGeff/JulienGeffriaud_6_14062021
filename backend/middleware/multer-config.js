const multer = require('multer'); // On importe le package multer

const MIME_TYPES = {  // dictionnaire MIME types
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //Création d'une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, 'images');   // indique à multer d'enregistrer les fichiers dans le dossier images
  },
  filename: (req, file, callback) => {  
    const name = file.originalname.split(' ').join('_'); // indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];  // utilise la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée (en fonction image envoyée par frontend)
    callback(null, name + Date.now() + '.' + extension); //  ajoute un timestamp Date.now() comme nom de fichier pour le rendre le + unique possible
  }
});

module.exports = multer({storage: storage}).single('image'); // Export de l'élément multer entièrement configuré, on lui passe l'objet storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers uniques image.