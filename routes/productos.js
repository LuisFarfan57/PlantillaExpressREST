const { Router } = require('express')
const { check } = require('express-validator')

const {
    validarCampos, validarJWT, esAdminRol, tieneRol
} = require('../middlewares')

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos')
const { existeProductoPorId, existeCategoriaPorNombre, existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router()

//Obtener todos los productos
router.get('/', obtenerProductos)

//Obtener 1 producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

//Crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'El id de la categoria no es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser numerico').isNumeric(),
    check('disponible', 'El valor de disponible debe ser true o false').isBoolean(),
    validarCampos
], crearProducto)

//Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id de la categoria no es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser numerico').isNumeric(),
    check('disponible', 'El valor de disponible debe ser true o false').isBoolean(),
    validarCampos
], actualizarProducto)

//Borrar producto - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router