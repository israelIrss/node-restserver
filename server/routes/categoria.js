const express = require('express');

const { VerificaToken, Verifica_rol } = require('../middlewares/autenticacion'); //tiene que estar en letras amarillas

const app = express();

let Categoria = require('../models/categoria'); //toma el modelo de la base de datos 
//actualiza una categoria
app.put('/categoria/:id', VerificaToken, (req, res) => {
        let id = req.params.id; // obtiene el id del link
        let body = req.body; //pide cuerpo de postman 
        let desCategoria = {
            descripcion: body.descripcion //jala los daots del cuerpo de postman

        }
        Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => { //busca dentro de la base de datos por id
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB //corrercto y se guarda 
            });

        })
    })
    //muestra todas las categorias 
app.get('/categoria', VerificaToken, (req, res) => {

        Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email') //que ids existen en la solicitud, muestra el id de quien lo creo 
            .exec((err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias //corrercto y se guarda 
                });
            })
    })
    //musestra una categoria por id 
app.get('/categoria/:id', VerificaToken, (req, res) => {
        let id = req.params.id
        Categoria.findById(id, (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false, //cualquier error
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB //corrercto y se guarda 
            });
        })
    })
    //crea nueva categoria 
app.post('/categoria', VerificaToken, (req, res) => { //agrega categoria 
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion, //obtiene datos del cuerpo de la peticion en postman 
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false, //cualquier error
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false, //categoria empty 
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB //corrercto y se guarda 
        });


    });


});




//elimina categoria 
app.delete('/categoria/:id', [VerificaToken, Verifica_rol], (req, res) => {
        let id = req.params.id; //solicita el id del link
        Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false, //verifica si existe el id  
                    err
                });
            }
            res.json({
                ok: true,
                message: 'categoria borrada'
            });
        })
    })
    //solo un administrador puede borrar 
module.exports = app;