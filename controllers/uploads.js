const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req = request, res = response) => {
    try {
        //Para subir otros tipos de archivos
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({
            nombre
        })
    }
    catch (msg) {
        res.status(400).json({msg})
    }
}

/**
 * Actualizar imagen sin cloudinary
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarImagen = async (req = request, res = response) => {
    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ususario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Actualizacion de coleccion no realizada aun'})
    }

    try {
        //Limpiar imagenes existentes
        const imagenAntigua = modelo.img

        modelo.img = await subirArchivo(req.files, undefined, 'imgs_' + coleccion)
        await modelo.save()

        //Despues de guardar en base de datos por si da un error
        if (imagenAntigua) {
            //Verificar que la imagen exista fisicamente
            const pathImagen = path.join(__dirname, '../uploads', 'imgs_' + coleccion, imagenAntigua)
            
            if (fs.existsSync(pathImagen)) 
                fs.unlinkSync(pathImagen)
        }

        res.json(modelo) 
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un ususario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Actualizacion de coleccion no realizada aun'})
    }

    try {
        //Limpiar imagenes existentes
        const imagenAntigua = modelo.img

        const {tempFilePath} = req.files.archivo
        //En el secure_url se obtiene el url donde se subio la imagen
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

        modelo.img = secure_url
        await modelo.save()

        //Despues de guardar en base de datos por si da un error
        if (imagenAntigua) {
            const nombreArr = imagenAntigua.split('/')
            const nombre = nombreArr[nombreArr.length - 1]
            //Obtiene el id de la imagen, ya que el nombre contiene la extension
            const [ public_id ] = nombre.split('.')

            //No tiene await porque no nos interesa esperar que termine
            cloudinary.uploader.destroy(public_id)
        }

        res.json(modelo) 
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const mostrarImagen = async (req = request, res = response) => {
    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                //Se puede devolver el error o devolver una imagen por defecto
                return res.status(400).json({
                    msg: `No existe un ususario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Actualizacion de coleccion no realizada aun'})
    }

    try {
        if (modelo.img) {
            //Verificar que la imagen exista fisicamente
            const pathImagen = path.join(__dirname, '../uploads', 'imgs_' + coleccion, modelo.img)
            
            if (fs.existsSync(pathImagen)) 
                return res.sendFile(pathImagen)
        }

        return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const mostrarImagenCloudinary = async (req = request, res = response) => {
    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                //Se puede devolver el error o devolver una imagen por defecto
                return res.status(400).json({
                    msg: `No existe un ususario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Actualizacion de coleccion no realizada aun'})
    }

    try {
        if (modelo.img) {
            return res.sendFile(modelo.img)
        }

        return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
    } catch (msg) {
        res.status(400).json({msg})
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}