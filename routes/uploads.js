const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarArchivoSubir } = require('../middlewares')

const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

//router.post('/', validarArchivoSubir,cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id no es un id de mongo valido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El id no es un id de mongo valido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagenCloudinary)

module.exports = router 