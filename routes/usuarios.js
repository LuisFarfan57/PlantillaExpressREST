const { Router } = require('express')
const { usuariosGet, usuariosPost, usuariosDelete, usuariosPut } = require('../controllers/usuarios')

const router = Router()

router.get('/', usuariosGet)

router.put('/:id', usuariosPut)

router.post('/', usuariosPost)

router.delete('/:id', usuariosDelete)

module.exports = router