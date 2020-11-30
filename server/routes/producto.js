const express = require('express');
const { verify } = require('jsonwebtoken');
const { VerificaToken, Verifica_rol } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

//crear un nuevo prodcto 
app.post('/productos', VerificaToken, (req, res) => {
        let body = req.body;
        let producto = new Producto({
            usuario: req.usuario._id, // este viene de la verificacion de token 
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria
        });

        //esta funcion guarda en la base de datos
        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }
            //representa que se creo un nuevo registro 
            res.status(201).json({
                ok: true,
                producto: productoDB //lo guarda en la base de datos

            })
        })

    })
    //actualiza un producto
app.put('/productos/:id', VerificaToken, (req, res) => {
        let id = req.params.id;
        let body = req.body;
        Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err: {
                        message: 'el producto no existe'
                    }
                });
            }
            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;
            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoGuardado
                });
            })





        })
    })
    //obtienne todos lo productos paginados
app.get('/productos', VerificaToken, (req, res) => {
        let desde = req.query.desde || 0;
        desde = Number(desde); //tienen que estar en numero ya que viene en string 
        Producto.find({ disponible: true })
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos
                });
            })
    })
    //obtiene un producto por id 
app.get('/productos/:id', VerificaToken, (req, res) => {
        let id = req.params.id;
        Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err
                    });
                }
                if (!productoDB) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err: {
                            message: 'no se encontro'
                        }
                    });
                }
                res.json({
                    ok: true,
                    producto: productoDB
                })


            });
    })
    //borrar un producto 
app.delete('/productos/:id', VerificaToken, (req, res) => {
        let id = req.params.id;
        Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false, //cualquier error
                    err: {
                        message: 'no se encontro'
                    }
                });
            }
            productoDB.disponible = false;
            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false, //cualquier error
                        err
                    });
                }
                res.json({
                    ok: true,
                    productoBorrado,
                    mensaje: 'producto borrado'
                })
            })
        })
    })
    //buscar productos
app.get('/productos/buscar/:termino', VerificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //busca por algo parecido no necesita el nombre especifico
    Producto.find({ nombre: regex }) //aqui se agregan todas las restricciones
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false, //cualquier error
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })

})

module.exports = app;