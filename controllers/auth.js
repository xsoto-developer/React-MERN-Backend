const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    const { name, email, password } = req.body
    try {
        // const emailRepeat = await Usuario.find({ email: email })
        let usuario = await Usuario.findOne({ email: email })
        if (usuario) {
            console.error('error: el email ya existe');
            return res.status(400).json({
                ok: false,
                msg: 'Email already existe in Data Base'
            }
            )
        }
        usuario = new Usuario(req.body)
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar jwt
        const token = await generarJWT(usuario.id, usuario.name);

        // if (name.length < 5) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'el nombre debe tener al menos 5 letras'
        //     });
        // }

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'new register!!',
            // user: { name: name, email: email, password: password }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                ok: false,
                msg: 'Internal server ERRROR'
            }
        )
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        // const emailRepeat = await Usuario.find({ email: email })
        let usuario = await Usuario.findOne({ email: email })
        if (!usuario) {
            console.error('el usuario no existe con ese email');
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            }
            )
        }

        // confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            console.error('password no valido');
            return res.status(400).json({
                ok: false,
                msg: 'El password es invalido'
            }
            )
        }

        // Generar jwt
        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'Logueado',
            // user: { name: name, email: email, password: password }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                ok: false,
                msg: 'Internal server ERRROR'
            }
        )
    }



}

const revalidarToken = async (req, res = response) => {
    console.log('Se requiere /')
    // const uid = req.uid;
    const { uid, name } = req;

    // Generar un nueov  token y  retornar 
    const nuevoToken = await generarJWT(uid, name);
    console.log(nuevoToken)


    res.json({
        ok: true,
        uid: uid,
        name: name,
        token: nuevoToken,
        // nombre: 'renew',

    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}