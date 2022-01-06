const { response, request } = require('express')
const { Producto, Categoria } = require('../models')

const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query

    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({total, productos})
}

const obtenerProducto = async (req = request, res = response) => {
    const producto = await Producto.findById(req.params.id).populate('usuario', 'nombre').populate('categoria', 'nombre')

    return res.json(producto)
}

const crearProducto = async (req = request, res = response) => {
    const { usuario, estado, ...data } = req.body
    data.nombre = data.nombre.toUpperCase()

    const productoDB = await Producto.findOne({nombre: data.nombre})

    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${data.nombre} ya existe`
        })
    }
    
    //Asignar el usuario
    data.usuario = req.usuario._id

    const producto = new Producto(data)

    //Guardar en DB
    await producto.save()

    return res.status(201).json(producto)
}

const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params

    //Se extrae lo que no se quiere actualizar
    const {estado, usuario, ...data} = req.body
    data.nombre = data.nombre.toUpperCase()

    //Obtiene una Producto con el mismo nombre, pero diferente id
    const productoExistente = await Producto.findOne({nombre: data.nombre, _id: { $ne: id }})

    if (productoExistente) {
        return res.status(400).json({
            msg: `Ya existe un producto con el nombre ${req.body.nombre}`
        })
    }

    //Asignar el usuario
    data.usuario = req.usuario._id

    //Se envia new: true para que obtenga el objeto actualizado
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre').populate('categoria', 'nombre')

    return res.json({producto})
}

const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params

    //Cambiar el estado
    const producto = await Producto.findByIdAndUpdate(id, {estado: false, usuario: req.usuario._id})
    
    return res.json({producto})
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}