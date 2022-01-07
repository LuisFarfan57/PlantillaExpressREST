const Role = require('../models/role')
const {Usuario, Categoria, Producto} = require('../models')

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const correoExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) 
        throw new Error(`El correo ${correo} ya esta registrado en la base de datos`)
}

const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) 
        throw new Error(`El id ${id} no existe en la base de datos`)
}

// Categorias //

const existeCategoriaPorId = async (id = '') => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) 
        throw new Error(`El id ${id} no existe en la base de datos`)
}

const existeCategoriaPorNombre = async (nombre = '') => {
    const existeCategoria = await Categoria.findOne({nombre: nombre.toUpperCase()})
    if (!existeCategoria) 
        throw new Error(`No existe una categoria con el nombre ${nombre}`)
}

// Productos //

const existeProductoPorId = async (id = '') => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) 
        throw new Error(`El id ${id} no existe en la base de datos`)
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)

    if (!incluida)
        throw new Error(`La coleccion ${coleccion} no es permitida - Colecciones permitidas: ${colecciones}`)

    return true
}

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existeCategoriaPorNombre,
    coleccionesPermitidas
}