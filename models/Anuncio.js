"use strict";

const mongoose = require ('mongoose');

// esquema del anuncio

const anuncioSchema = mongoose.Schema({
    nombre: {type: String, 
            index: true
          },
     venta: {type: Boolean,
            index: true
          },
    precio: {type: Number, 
            index: true
          },
      foto: String,
      tags: {type: [String], 
            index: true
          }
});

// método estático list
anuncioSchema.statics.list = function(filter, limit, skip, fields, sort, callback) {
  const query = Anuncio.find(filter);

  query.limit(limit);
  query.skip(skip);
  query.select(fields);
  query.sort(sort);
  query.exec(callback);
};

// método estático que lsita tags
anuncioSchema.statics.listaTags = function(callback){
    Anuncio.distinct('tags',callback);
};

// Creamos el modelo 
// Usamos var para hacer hoisting y que esté visible en todo el módulo
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;