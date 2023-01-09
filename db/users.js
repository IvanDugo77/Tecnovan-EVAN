const bcrypt = require('bcrypt');
const { getConnection } = require('./db');
const { generateError } = require('../helpers');


// Crea un usuario en la base de datos y devuelve su id por consola
const createUser = async (user, email, password) => {
    let connection;
  
    try {
      connection = await getConnection();
      //Comprueba si ya existe el usuario
      const [query] = await connection.query(
        `
        SELECT id FROM usuarios WHERE email = ?
      `,
        [email]
      );
      if (query.length > 0) {
        throw generateError(
          'El email ya existe',
          409
        );
      }
      //Encriptar la password
      const passwordHash = await bcrypt.hash(password, 8);

      //Si el Usuario a confirmado el registro, se introduce en la bbdd
  
      //Crear el usuario
      const [newUser] = await connection.query(
        `
        INSERT INTO usuarios (usuario,email, password) VALUES(?,?,?)
      `,
        [user, email, passwordHash]
      );

      //Devolver la id
      return newUser.insertId;
    } finally {
      if (connection) connection.release();
    }
  };
  const getUserByEmail = async (email) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        SELECT * FROM usuarios WHERE email = ?
      `,
        [email]
      );
  
      if (result.length === 0) {
        throw generateError('No hay ningún usuario registrado con ese email', 404);
      }
      return result[0];
    } finally {
      if (connection) connection.release();
    }
  };
  
  const modifyUser = async (userId,biografia, avatar) => {
    let connection;
    try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
     UPDATE usuarios SET biografia = ?, avatar = ? WHERE ID = ?
    `,
      [biografia,avatar,userId]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }};

  module.exports = {
    createUser,
    getUserByEmail,
    modifyUser,
  };