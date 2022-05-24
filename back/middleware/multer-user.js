/******************************************************************************************** */
/**Configuration de Multer pour la gestion de fichier USER                                    */
/******************************************************************************************** */

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/user');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
const multerFilter = (req, file, callback) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

/******************************************************************************************** */
/**Exportation du module                                                                    */
/******************************************************************************************** */
module.exports = multer({storage: storage, fileFilter:multerFilter}).single('image');
