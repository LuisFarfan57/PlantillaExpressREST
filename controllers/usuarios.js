//Para que vs code nos ayude a utilizar los objetos y propiedades
const { response, request } = require('express')

const usuariosGet = (req = request, res = response) => {
    //Mas facil para obtener los querys, y controlar por si no lo envia
    const { q, limit, page = 1 } = req.query

    res.json({mensaje: 'get API - controlador', q, limit, page})
}

const usuariosPut = (req = request, res = response) => {
    const { id } = req.params

    res.json({mensaje: 'put API - controlador', id})
}

const usuariosPost = (req = request, res = response) => {
    const body = req.body

    res.status(201).json({mensaje: 'post API - controlador', body: body})
}

const usuariosDelete = (req = request, res = response) => {
    const { id } = req.params
    
    res.json({mensaje: 'delete API - controlador', id})
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}