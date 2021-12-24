const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario')

const login = async (req = request, res = response) => {
    const { correo, password } = req.body

    try {
        //Verificar si el correo existe
        const usuario = await Usuario.findOne({correo})

        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas - Usuario no encontrado'
            })
        }

        //Verificar que el usuario este activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas - Usuario no activo'
            })
        }

        //Verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas - Password incorrecta'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id)

        return res.json({usuario, token})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req = request, res = response) => {
    const {id_token} = req.body

    try {
        const {nombre, img, correo, googleId} = await googleVerify(id_token)

        // Verificar si el correo ya existe en la base de datos
        let usuario = await Usuario.findOne({correo})

        if (!usuario) {
            //Crear un nuevo usuario
            const data = {
                nombre,
                correo,
                password: 'asdfasdf',
                img,
                google: true,
                rol: 'ROLE_USER',
                googleId
            }

            usuario = new Usuario(data)
            await usuario.save()
        }
        else {
            if (!usuario.google && usuario.estado) {
                usuario.google = true
                usuario.googleId = googleId
                await usuario.save()
            }
        }

        //Si el usuario en base de datos tiene el estado en false
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Por favor hable con el administrador. Usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id)

        return res.json({usuario, token})
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}