const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();
const { verificaTokenImg } = require('../middlewares/autenticacion')


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => { //tambien verifica token
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`); //ruta absoluta imagen
    if (fs.existsSync(pathImagen)) { //verifica que exista imagen si si la manda si no manda el no imagen
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg') //ruta apsoluta no imagen
        res.sendFile(noImagePath);
    }

});





module.exports = app;