//Paquetes de librerias npm
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");



//Importación de controladores de usuarios

const {newUserController,loginController,userUpdateController} = require('./controllers/usuarios');
//Importación de controladores de productos

const {newProductController,getProductNameController,getProductPriceController,getProductCategoryController,getProductLocationController,buyProductController,soldProductcontroller} = require('./controllers/productos');

//Importación de la carpeta middleware auth

const {authUser} = require('./middlewares/auth');

//Define express como app
const app = express();

//middleware para procesar los archivos json que llegan del req.body
app.use(express.json());

//middleware para decodificar ficheros subidos como imagenes desde form-data
app.use(fileUpload());

//middleware visualizador tiempo de respuesta y petición
app.use(morgan('dev'));

//Endpoints
//Crear usuario nuevo
app.post('/user',newUserController);
//Logear usuario registrado
app.post('/login',loginController);
//Update datos biografia y foto de perfil
app.post('/user/update',authUser,userUpdateController);
//Crear producto y almacenar en bbdd
app.post('/producto',authUser,newProductController);
//Busqueda por nombre
app.get('/producto/nombre/:nombre',getProductNameController);
//Busqueda por precio
app.get('/producto/precio/:precio',getProductPriceController);
//Busqueda por categoria
app.get('/producto/categoria/:categoria',getProductCategoryController);
//Busqueda por localidad
app.get('/producto/localidad/:localidad',getProductLocationController);
//Solicitud de compra del comprador
app.post('/producto/compra' ,authUser,buyProductController);
//Aceptación de la compra y asignación del lugar de venta y fecha
app.post('/producto/vendido',authUser,soldProductcontroller);


//Middleware de para fallos 404
app.use((req,res) => {
    res.status(404).send({
        status:'error',
        message:'not found',
    });
});

//Middleware para otros posibles fallos
app.use((error,req,res,next) =>{
    console.error(error);
    res.status(error.httpStatus || 500).send({
        status:'error',
        message: error.message,
    });
});

//Puerto de escucha 5500
app.listen(5500, () => {
    console.log('Servidor conectado');
});