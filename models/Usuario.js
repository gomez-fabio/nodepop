"use strict";

const mongoose = require ('mongoose');

// esquema del usuario

const usuarioSchema = mongoose.Schema({
    nombre: String,
     email: {type: String, 
             index: true, 
            unique: true
          },
     clave: String
});

// método estático buscaEmailUsuario
usuarioSchema.statics.buscaEmailUsario = function(email, callback) {
    const query = Usuario.find({email: email});
    query.exec(callback);
};


// Creamos el modelo
var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;