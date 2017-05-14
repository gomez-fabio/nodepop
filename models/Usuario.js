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

// Creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;