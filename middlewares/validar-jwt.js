const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    console.log('Antes de validar el token ')
    /// x-token headers
    const token = req.header('x-token');
    console.log(token)
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No  hay token en la validacion '
        })
    }


    try {
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        console.log(uid);
        console.log(name);

        req.uid =  uid;
        req.name =  name;

    } catch  (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'token no valido'
        })

    }


    next();
}

module.exports = {
    validarJWT
}
