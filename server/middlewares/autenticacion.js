const jwt = require('jsonwebtoken');

/////
///
//  Verifica token
let VerificaToken = (req, res, next) => {
    let token = req.get('token');
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};
//verifica rol
let Verifica_rol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        res.json({
            ok: false,
            err: {
                message: 'el usuairio no es administrador'
            }
        });
    }
};
//verifica token en imagen
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    VerificaToken,
    Verifica_rol,
    verificaTokenImg
}