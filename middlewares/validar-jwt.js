const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        //Si esto falla, tira el catch
        //Y tambien esto devuelve el contenido del body
        const {uid} = jwt.verify(token, process.env.SECRET_KEY)
        
        const usuario = await Usuario.findById(uid)

        //Verificar que el usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en base de datos'
            })
        }

        //Verificar que el usuario este activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no activo'
            })
        }

        //Establece la informacion del usuario autenticado en la request
        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}