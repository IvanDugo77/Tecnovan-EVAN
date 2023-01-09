//Importa configuracion del archivo env necesario para la apertura y acceso al servidor mysql
require('dotenv').config();
//Importacion la función getConnection del archivo db.js
const {getConnection} = require('./db');

//Borra si existe las tablas creadas y crea de nuevo las tablas, introduciendo los valores predefinidos en la tabla categoria.
async function main() {
    let connection;
//crea una conexión con mysql y posteriormente realiza las siguientes peticiónes a mysql
    try{
        connection = await getConnection();

        console.log('Borrando tablas');
        await connection.query('DROP TABLE IF EXISTS productos');
        await connection.query('DROP TABLE IF EXISTS categoria');
        await connection.query('DROP TABLE IF EXISTS localidad');
        await connection.query('DROP TABLE IF EXISTS usuarios');
        
        console.log('Creando tablas');
         await connection.query(`
         CREATE TABLE usuarios (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            usuario VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            biografia VARCHAR(250),
            avatar VARCHAR(300)
         )`);

         await connection.query(`
         CREATE TABLE categoria (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(100) NOT NULL
         )`);

         await connection.query(`
         CREATE TABLE localidad(
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(50)
         )`);

         await connection.query(`
         CREATE TABLE productos (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(100) NOT NULL,
            usuario_id INT UNSIGNED NOT NULL,
            comprador_id INT UNSIGNED,
            fecha VARCHAR(50),
            ubicacion_venta VARCHAR(100),
            estado_venta VARCHAR(50),
            descripcion VARCHAR(500) NOT NULL,
            precio INT UNSIGNED NOT NULL,
            imagen VARCHAR(100) ,
            categoria_id INT UNSIGNED NOT NULL,
            localidad_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (localidad_id) REFERENCES localidad(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (categoria_id) REFERENCES categoria(id)
         )`);

         await connection.query(`INSERT INTO tecnovan.localidad (nombre) VALUES ('Albacete'),('Alicante/Alacant'),('Almería'),('Araba/Álava'),('Asturias'),('Ávila'),('Badajoz'),('Balears, Illes'),('Barcelona'),('Bizkaia'),('Burgos'),('Cáceres'),('Cádiz'),('Cantabria'),('Castellón/Castelló'),('Ceuta'),('Ciudad Real'),('Córdoba'),('Coruña, A'),('Cuenca'),('Gipuzkoa'),('Girona'),('Granada'),('Guadalajara'),('Huelva'),('Huesca'),('Jaén'),('León'),('Lugo'),('Lleida'),('Madrid'),('Málaga'),('Melilla'),('Murcia'),('Navarra'),('Ourense'),('Palencia'),('Palmas, Las'),('Pontevedra'),('Rioja, La'),('Salamanca'),('Santa Cruz de Tenerife'),('Segovia'),('Sevilla'),('Soria'),('Tarragona'),('Teruel'),('Toledo'),('Valencia/València'),('Valladolid'),('Zamora'),('Zaragoza');`)

         await connection.query(`INSERT INTO tecnovan.categoria (nombre) VALUES ('foto'),('video'),('pc'),('television'),('radio'),('moviles'),('consolas');`);


    } catch(error){
        console.error(error);
    } //cierra el servidor despues de realizar el catch o el try
    finally{
        if(connection) connection.release();
        process.exit();
    }
}

//llamada a la función main
main();