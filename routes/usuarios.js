const { Router } = require('express')
const { check } = require('express-validator')
const { usuariosGet, usuariosPost, usuariosDelete, usuariosPut } = require('../controllers/usuarios')
const { esRolValido, correoExiste, existeUsuarioPorId } = require('../helpers/db-validators')

// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { esAdminRol, tieneRol } = require('../middlewares/validar-roles')

//Asi se pueden optimizar las importaciones, ya que todo esto viene de la carpeta middlewares
//Se crea un archivo index.js, por eso solo se require middlewares, sin el archivo en si
const {
    validarCampos, validarJWT, esAdminRol, tieneRol
} = require('../middlewares')

const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    check('correo').custom(correoExiste),
    validarCampos
], usuariosPut)

router.post('/', [
    //Middlewares extras
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(correoExiste),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y con más de 6 caracteres').not().isEmpty().isLength({min: 6}),
    //check('rol', 'No es un rol válido').isIn(['ROLE_USER', 'ROLE_ADMIN']),
    //Porque es mejor validar en base de datos los roles. Utiliza una funcion custom
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    esAdminRol,
    //Asi se pueden enviar argumentos a los middlewares
    tieneRol('ROLE_ADMIN', 'ROLE_USER', 'ROLE_VENTAS'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

module.exports = router