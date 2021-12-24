const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')
const {login, googleSignIn} = require('../controllers/auth')

const router = Router()

router.post('/login', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)

router.post('/google', [
    check('id_token', 'El token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn)

module.exports = router