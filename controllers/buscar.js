const { request, response } = require("express")
const { ObjectId } = require('mongoose').Types
const {Usuario, Categoria, Producto, Role} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)

    //Si el termino es un id de mongo, busca por id
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({results: (usuario ? [usuario] : [])})
    }

    //Esto significa que sea insensible a las mayusculas
    const regexp = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({
        $or: [{ nombre: regexp }, { correo: regexp }],
        $and: [{ estado: true }]
    })

    return res.json({
        results: usuarios
    })
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)

    //Si el termino es un id de mongo, busca por id
    if (esMongoID) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre')
        return res.json({results: (categoria ? [categoria] : [])})
    }

    //Esto significa que sea insensible a las mayusculas
    const regexp = new RegExp(termino, 'i')

    const categorias = await Categoria.find({ nombre: regexp, estado: true }).populate('usuario', 'nombre')

    return res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)

    //Si el termino es un id de mongo, busca por id
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('usuario', 'nombre').populate('categoria', 'nombre')
        return res.json({results: (producto ? [producto] : [])})
    }

    //Esto significa que sea insensible a las mayusculas
    const regexp = new RegExp(termino, 'i')

    const productos = await Producto.find({ nombre: regexp, estado: true }).populate('usuario', 'nombre').populate('categoria', 'nombre')

    return res.json({
        results: productos
    })
}

const buscarRoles = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)

    //Si el termino es un id de mongo, busca por id
    if (esMongoID) {
        const rol = await Role.findById(termino)
        return res.json({results: (rol ? [rol] : [])})
    }

    //Esto significa que sea insensible a las mayusculas
    const regexp = new RegExp(termino, 'i')

    const roles = await Role.find({ rol: regexp })

    return res.json({
        results: roles
    })
}


const buscar = (req = request, res = response) => {
    const {coleccion, termino} = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'roles':
            buscarRoles(termino, res)
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}