const { Router } = require('express')
const { check } = require('express-validator')

const {
    validarCampos, validarJWT, esAdminRol, tieneRol
} = require('../middlewares')

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias')
const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router()

//Obtener todas las categorias
router.get('/', obtenerCategorias)

//Obtener 1 categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    tieneRol('ROLE_ADMIN', 'ROLE_USER', 'ROLE_VENTAS'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria)

//Borrar categoria - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria)

module.exports = router