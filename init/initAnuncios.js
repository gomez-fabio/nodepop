"use strict";

const mongoose = require('mongoose');
const Anuncios = require('../models/Anuncio');
const modeloAnuncio  = mongoose.model('Anuncio');

const leerFichero = require('./leeFichero');

// Funcion que devuelve una promesa con la que leemos el json
function leerJson() {
  return new Promise((resolve, reject) => {
    leerFichero('anuncios.json', (err, initJson) => {
      if (err) {
        reject(err);
      }
      resolve(initJson);
    });
  });
}

// funcion ppal, borramos anuncios, leemos fichero json y cargamos lo leido
async function initAnuncios(){

    // Borramos el contenido de la colección 
    await Anuncios.remove({}, (err) => {
        if (err) {
            reject(err);
        }
    });

    const listaEnJson = await leerJson(); // leer json
    
    // cargamos lo leído del json
    await Anuncios.insertMany(listaEnJson.anuncios, (err) =>{
        if (err){
            reject(err);
        }
    });
    
console.log("Colección de anuncios inicializada correctamente.\n");
}

module.exports = initAnuncios;