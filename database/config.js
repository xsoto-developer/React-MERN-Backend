const mongoose = require('mongoose')
require('dotenv').config();

// console.log(process.env)
// console.log(`Servidor corriendo BASE DE DATOS ${process.env.DB_CNN}`);
const dbConnection = async () => {
    try {

        // await mongoose.connect(process.env.DB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true
        // });
        await mongoose.connect(process.env.DB_CNN);
        console.log('BD Online')

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicialzar la base de datos');
    }
}

module.exports = {
    dbConnection
}