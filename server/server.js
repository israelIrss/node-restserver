const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./config/config')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/usuarios', function(req, res) {
    res.json('getUsusario')
})
app.post('/usuarios', function(req, res) {

    let body = req.body;
    if (body.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        })
    } else {
        res.json({
            body
        })
    }

})
app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})
app.delete('/usuarios', function(req, res) {
    res.json('deleteUsuario')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});