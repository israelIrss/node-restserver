const { json } = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//se sube imagen 
app.use(fileUpload());

//guarda archivo 
app.put('/upload/:tipo/:id', function(req, res) { //se agrego tipo y id
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) { //revisa que se suba un archivo 
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'no se subio archivo '
                }
            });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) { //verifica que exista el tipo
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no es una categoria valida'
            }
        })
    }

    let archivo = req.files.archivo; //nombre que se le coloca en postman
    //extensiones permitidas
    let extesionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'JPG'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]; //optenemos tipo de archivo

    if (extesionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no es un formato valido'
            }
        })
    }
    //cambiar nombre al archivo agrega milisegundos
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        //aqui ya sabemos que se subio la imagen
        if (tipo === 'usuarios') {
            imageUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imageUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        } //error comun
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'usuario no existe'
                    }
                });
        }


        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            } //error comun
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });



    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        } //error comun
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'producto no existe'
                    }
                });
        }


        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            } //error comun
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        });



    });
}

function borraArchivo(nombreImagen, tipo) {
    //borrar imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //navega a la ruta (se crea path absoluto )
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    } //verifica si existe y borra   
}
module.exports = app;