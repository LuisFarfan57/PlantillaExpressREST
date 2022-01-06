const {Schema, model} = require('mongoose')

const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
})

ProductoSchema.methods.toJSON = function() {
    const {__v, estado, ...datos} = this.toObject()

    return {...datos}
}

module.exports = model('Producto', ProductoSchema)