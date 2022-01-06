const { response, request } = require('express')
const { Categoria } = require('../models')

const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query

    const query = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({total, categorias})
}

const obtenerCategoria = async (req = request, res = response) => {
    const categoria = await Categoria.findById(req.params.id).populate('usuario', 'nombre')

    return res.json(categoria)
}

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data a aguardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    //Guardar en DB
    await categoria.save()

    return res.status(201).json(categoria)
}

const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params

    //Se extrae lo que no se quiere actualizar
    const {estado, usuario, ...data} = req.body
    data.nombre = data.nombre.toUpperCase()

    //Obtiene una categoria con el mismo nombre, pero diferente id
    const categoriaExistente = await Categoria.findOne({nombre: data.nombre, _id: { $ne: id }})

    if (categoriaExistente) {
        return res.status(400).json({
            msg: `Ya existe una categoria con el nombre ${req.body.nombre}`
        })
    }

    data.usuario = req.usuario._id

    //Se envia new: true para que obtenga el objeto actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})

    return res.json({categoria})
}

const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params

    //Cambiar el estado
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false, usuario: req.usuario._id})
    
    return res.json({categoria})
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}