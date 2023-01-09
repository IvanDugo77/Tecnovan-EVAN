const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const {generateError,createPathIfNotExists} = require('../helpers');
const {createUser,getUserByEmail,modifyUser} = require('../db/users');

//Funcion que introduce un nuevo usuario a la base de datos
const newUserController = async (req,res,next) => {
    try {
        const {user, email, password } = req.body;

    //Posibilidad de utilizar un joi
        if ( !user || !email || !password ) {
          throw generateError('Debes rellenar todos los campos', 400);
        }
        const id = await createUser(user, email, password);
    
        res.send({
          status: 'ok',
          message: `Usuario creado con id: ${id}`,
        });
      } catch (error) {
        next(error);
      }
};

//Comprueba si el usuario esta registrado en la base de datos y genera un token para la autentificación del mismo  
const loginController = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        throw generateError('Debes completar los campos', 400);
      }

      // Recojo los datos de la base de datos del usuario con ese mail
      const user = await getUserByEmail(email);
  
      // Compruebo que las contraseñas coinciden
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        throw generateError('La contraseña no coincide', 401);
      }

      // Creo el payload del token
      const payload = { id: user.id };
  
      // Firmo el token
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: '30d',
      });
  
      // Envío el token
      res.send({
        status: 'ok',
        data: token,
      });

    } catch (error) {
      next(error);
    }
  };
const userUpdateController = async (req,res,next) => {
  try {
    const {biografia} = req.body;

    if (!biografia || biografia.length > 250) {
      throw generateError(
        'Debes rellenar el campo',
        400
      );
    }
    let imageFileName;
    if (req.files && req.files.image) {
      // Creo el path del directorio avatars
      const uploadsDir = path.join(__dirname, '../avatars');
      // Creo el directorio 
      await createPathIfNotExists(uploadsDir);
      const image = sharp(req.files.image.data);
      image.resize(1000);
      //Guardar con nombre aleatorio
      imageFileName = `${nanoid(24)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    await modifyUser(req.usuario_id,biografia,imageFileName);

    res.send({
      status: 'ok',
      message: `Su perfil ha sido actualizado`,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
newUserController,
loginController,
userUpdateController,
};