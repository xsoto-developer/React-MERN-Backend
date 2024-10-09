const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

require('dotenv').config();

// console.log(process.env)
// console.log('Hola Mundo XXXXXXXXXXXXXXXXXXXXXXXXXXXx');
// crear el servidor de express
const app = express();

// Base de datos 
dbConnection();

//CORS
app.use(cors())

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
// TODO auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'));

// TODO CRUD: Eventos
app.use('/api/events', require('./routes/events'));


// Escuchar perticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});