require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // ayuda a colocar rutas

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    //habilitar carpeta public para poder acceder
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));
// parse application/json
//configuracion global de rutas
app.use(bodyParser.json())
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log('base de datos online');

    });



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});