//Para que vs code nos ayude a utilizar los objetos y propiedades
const { response, request } = require('express')
const bcrypt = require('bcryptjs')
//Importar el modelo
const Usuario = require('../models/usuario')

const usuariosGet = async (req = request, res = response) => {
    //Mas facil para obtener los querys, y controlar por si no lo envia
    const { limite = 5, desde = 0 } = req.query

    //Para obtener solo los activos, no los eliminados
    const query = {estado: true}

    //Si se usa await, se bloquean los querys. Pero como no dependen una de otra, se pueden hacer simultaneas
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    //Ayuda para la paginacion
    // const total = await Usuario.countDocuments(query)

    //Promise.all ejecuta todas al mismo tiempo. Para aprovechar el non blocking de node
    //Reduce a la mitad el tiempo
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({total, usuarios})
}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params
    //Se extrae lo que no se quiere actualizar
    const { _id, password, google, ...resto } = req.body

    //Si viene el password significa que esta editando el password
    if (password) {
        //Encriptar la contrasena
        const salt = bcrypt.genSaltSync()
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({usuario})
}

const usuariosPost = async (req = request, res = response) => {
    //Solo se obtiene lo que se quiere grabar
    const { nombre, correo, password, rol } = req.body

    //Crea de una vez el objeto que se persistira a la base de datos.
    //Como se le manda el objeto, mongoose adapata las propiedades al modelo
    const usuario = new Usuario({nombre, correo, password, rol})

    //Encriptar la contrasena
    //Se le envian las rondas, entre mas alto. Mas seguro. 10 por defecto
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    //Se persisten los cambios a la base de datos
    await usuario.save()

    res.status(201).json({usuario})
}

const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params

    //Lo borramos fisicamente
    //Obtiene el usuario que encontro
    //const usuario = await Usuario.findByIdAndDelete(id)

    //Cambiar el estado
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    
    res.json({usuario})
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}