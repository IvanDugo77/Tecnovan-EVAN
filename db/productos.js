const { getConnection } = require('./db');
const{generateError} = require('../helpers');


const createProduct = async (usuario_id, nombre, descripcion, precio, imagen = '',categoria_id,localidad_id,estadoVenta) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        INSERT INTO productos (usuario_id,nombre,descripcion,precio,imagen,categoria_id,localidad_id,estado_venta)
        VALUES(?,?,?,?,?,?,?,?);
      `,
        [usuario_id,nombre,descripcion,precio,imagen,categoria_id,localidad_id,estadoVenta]
      );
  
      return result.insertId;
    } finally {
      if (connection) connection.release();
    }
  };
  const getProductByNombre = async (nombre) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        SELECT nombre,imagen,descripcion,categoria_id,precio,localidad_id FROM productos WHERE nombre = ?
      `,
        [nombre]
      );
  
      if (result.length === 0) {
        throw generateError(`El Producto con Nombre: ${nombre} no existe`, 404);
      }
  
      return result;
    } finally {
      if (connection) connection.release();
    }
  };
  const getProductByPrecio = async (precio) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        SELECT nombre,imagen,descripcion,categoria_id,precio,localidad_id FROM productos WHERE precio = ?
      `,
        [precio]
      );
  
      if (result.length === 0) {
        throw generateError(`El Producto con Precio: ${precio} no existe`, 404);
      }
  
      return result;
    } finally {
      if (connection) connection.release();
    }
  };
  const getProductByCategoria = async (nombre) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
       `SELECT nombre,imagen,descripcion,categoria_id,precio,localidad_id FROM productos WHERE categoria_id = ?`
      ,
        [nombre]
      );
  
      if (result.length === 0) {
        throw generateError(`El Producto de la Categoria: ${nombre} no existe`, 404);
      }
  
      return result;
    } finally {
      if (connection) connection.release();
    }
  };
  const getProductByLocalidad = async (nombre) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
       SELECT nombre,imagen,descripcion,categoria_id,precio,localidad_id FROM productos WHERE localidad_id = ?
      `,
        [nombre]
      );
  
      if (result.length === 0) {
        throw generateError(`El Producto de la Localidad: ${nombre} no existe`, 404);
      }
  
      return result;
    } finally {
      if (connection) connection.release();
    }
  };
  const searchProduct = async (userId,productoId) => {
    let connection;
    let estadoVenta = "Pendiente aceptar";

     try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
     UPDATE productos SET estado_venta = ?, comprador_id = ? WHERE id = ?
    `,
      [estadoVenta,userId,productoId]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
  }
  const soldProduct = async (userId,productoId,fecha,ubicacionVenta) => {
    let connection;
    let estadoVenta = "Vendido";
     try {

    connection = await getConnection();
    
    await connection.query(
      `
     UPDATE productos SET estado_venta = ?, fecha = ? , ubicacion_venta = ? WHERE id = ?
    `,
      [estadoVenta,fecha,ubicacionVenta,productoId]
    );

  
  } finally {
    if (connection) connection.release();
  }};
  module.exports = {
    createProduct,
    getProductByNombre,
    getProductByPrecio,
    getProductByCategoria,
    getProductByLocalidad,
    searchProduct,
    soldProduct,
  };