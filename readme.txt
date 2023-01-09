
TECNOVAN 


IMPORTAR API POSTMAN :https://api.postman.com/collections/24930101-6d859b18-0465-482c-b5b7-456d3db19384?access_key=PMAT-01GPCC0P8HCCDW2VR903JNNW34

Descripción del proyecto

Este proyecto trata de una plataforma de compraventa de productos retro al estilo wallpop.

Descripción de la inicialización:

Establecer una conexión con postman con el puerto de escucha 5500.

Establecer en el fichero .env en el apartado MYSQL_PASSWORD una contraseña para el acceso a la base de datos a traves de la aplicación MYSQL.

Descargar las librerias preconfiguradas en el package.json con el comando:

npm install

Ejecutar en la consola de comandos de visual studio el siguiente comando:

node db/initDB.js

Esto generara las tablas en la base de datos prestablecida como tecnovan (nombre del proyecto).

Para ejecutar el servidor y que este este a la escucha de las peticiones ejecutar en al misma linea de comandos:

node server.js

Cargar en el PostMan la api para preconfigurar los endpoints del proyecto

Descripción del funcionamiento:

//Endpoints
Con este endpoint se genera un nuevo registro de usuario en la base de datos
app.post('/user',newUserController);


Con este endpoint el usuario se logea y obtiene un token de verificación personal
app.post('/login',loginController);
Para que el programa sepa quien es el usuario logeado , se tiene que copiar el token que genera el middleware authUser, eso le permitira crear productos , vender, comprar y gestionar su propio  
perfil


Con este endpoint el usuario verificado puede añadir una imagen y una biografia a su perfil, y modificarla a placer
app.post('/user/update',authUser,userUpdateController);


Este endpoint es para crear un producto, solamente puede crearlo los usuarios verificados
app.post('/producto',authUser,newProductController);


Estos endpoints son para filtrados de busqueda por Nombre , Precio , Localidad , Categoria


app.get('/producto/nombre/:nombre',getProductNameController);
app.get('/producto/precio/:precio',getProductPriceController);
app.get('/producto/categoria/:categoria',getProductCategoryController);
app.get('/producto/localidad/:localidad',getProductLocationController);


Este endpoint sirve para solicitar la compra de un producto
app.post('/producto/compra' ,authUser,buyProductController);



Este endpoint sirve para aceptar la compra del producto y acordar lugar y fecha de la propia venta.
app.post('/producto/vendido',authUser,soldProductcontroller);


NOTAS:





