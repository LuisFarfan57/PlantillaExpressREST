const Role = require('../models/role')
const Usuario = require('../models/usuario')

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

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId
}