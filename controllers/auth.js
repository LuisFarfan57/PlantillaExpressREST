const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
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

module.exports = login