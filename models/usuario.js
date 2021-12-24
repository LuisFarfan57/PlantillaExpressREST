// {
//     nombre: '',
//     correo: 'asdf@correo.com',
//     password: 'asdfasdf',
//     img: 'asdfadsf',
//     rol: 'asdfasdf',
//     //Activo o no el usuario
//     estado: true,
//     //Si inicio sesion con google
//     google: false
// }

const { Schema, model } = require('mongoose')

//Se crea el modelo de la coleccion
const UsuarioSchema = Schema({
    nombre: {
        //Constraints, pero lo ideal es limpiar la data antes
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        enum: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
    },
})

//Se pueden sobreescribir metodos de mongoose u otras cosas
//Funcion normal para que haga referencia al this del objeto
UsuarioSchema.methods.toJSON = function() {
    //Sacando la version y el password del usuario. Para que no se le regrese en la peticion.
    //Esta sobreescribiendo el metodo toJSON de mongoose
    const {__v, password, _id, ...usuario} = this.toObject()

    //Esto para que se muestre uid en lugar de _id
    return {...usuario, uid: _id}
}

module.exports = model('Usuario', UsuarioSchema)