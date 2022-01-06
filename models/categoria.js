const {Schema, model} = require('mongoose')

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        //El nombre de la referencia debe ser el mismo que se pone en el metodo model() al exportar
        ref: 'Usuario',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...categoria} = this.toObject()

    return {...categoria}
}

module.exports = model('Categoria', CategoriaSchema)