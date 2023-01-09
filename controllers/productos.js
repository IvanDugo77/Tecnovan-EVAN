const { generateError, createPathIfNotExists } = require('../helpers');
const {createProduct,getProductByNombre, getProductByPrecio, getProductByCategoria, getProductByLocalidad,searchProduct,soldProduct} = require('../db/productos');


const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const newProductController = async (req, res, next) => {
    try {
      const {nombre,descripcion,precio,categoria_id,localidad_id } = req.body;

      if(!nombre || !descripcion || !precio || !categoria_id || !localidad_id) {
        throw generateError('Debes rellenar todos los campos',400)
      }

      console.log(req.files);
      let imageFileName;
      if (req.files && req.files.image) {
        // Creo el path del directorio uploads
        const uploadsDir = path.join(__dirname, '../uploads');
        // Creo el directorio 
        await createPathIfNotExists(uploadsDir);
        const image = sharp(req.files.image.data);
        image.resize(1000);
        //Guardar con nombre aleatorio
        imageFileName = `${nanoid(24)}.jpg`;
  
        await image.toFile(path.join(uploadsDir, imageFileName));
      }
      
let estadoVenta = "Disponible";
      const id = await createProduct(req.usuario_id, nombre, descripcion, precio, imageFileName,categoria_id,localidad_id,estadoVenta);
  
      res.send({
        status: 'ok',
        message: `Producto con id: ${id} creado correctamente`,
      });
    } catch (error) {
      next(error);
    }
  };
const getProductNameController = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const producto = await getProductByNombre(nombre);

    res.send({
      status: 'ok',
      data: producto,
    });
  } catch (error) {
    next(error);
  }
};
const getProductPriceController = async (req, res, next) => {
  try {
    const { precio } = req.params;
    const producto = await getProductByPrecio(precio);

    res.send({
      status: 'ok',
      data: producto,
    });
  } catch (error) {
    next(error);
  }
};
const getProductCategoryController = async (req, res, next) => {
  try {
    const {categoria} = req.params;
    const producto = await getProductByCategoria(categoria);

    res.send({
      status: 'ok',
      data: producto,
    });
  } catch (error) {
    next(error);
  }
};
const getProductLocationController = async (req, res, next) => {
  try {
    const {localidad} = req.params;
    const producto = await getProductByLocalidad(localidad);

    res.send({
      status: 'ok',
      data: producto,
    });
  } catch (error) {
    next(error);
  }
};
const buyProductController = async (req, res, next) => {
  try {
    const {productoId} = req.body;

    if(!productoId) {
      throw generateError('No existe ese producto en la base de datos',400)
    }
     await searchProduct(req.usuario_id,productoId);

    res.send({
      status: 'ok',
      message: 'Su petición de compra se ha enviado',
    });
  } catch (error) {
    next(error);
  }
}
const soldProductcontroller = async (req, res, next) => {
  try {
    const {productoId,fecha,ubicacionVenta} = req.body;

    if(!productoId) {
      throw generateError('No existe ese producto en la base de datos',400)
    }

     await soldProduct(req.usuario_id,productoId,fecha,ubicacionVenta);

    res.send({
      status: 'ok',
      message: `El vendedor con id = ${req.usuario_id} ha aceptado la compra del producto`,
    });
  } catch (error) {
    next(error);
  }};

  module.exports = {
    newProductController,
    getProductNameController,
    getProductPriceController,
    getProductCategoryController,
    getProductLocationController,
    soldProductcontroller,
    buyProductController,
  };
