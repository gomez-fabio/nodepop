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

// Función que devuelve una promesa con la que cargamos el anuncio
function cargarAnuncio(anuncioNuevo){
    return new Promise((resolve, reject) =>{
        const anuncio = new modeloAnuncio(anuncioNuevo);
        anuncio.foto = '/images/anuncios/' + anuncio.foto;
        anuncio.save(anuncioNuevo, (err, cargado) =>{
            if (err) {
                reject(err);
            }
            resolve(cargado);
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
    for (let i = 0 ; i < listaEnJson.anuncios.length ; i ++){
        await cargarAnuncio(listaEnJson.anuncios[i], (err, anuncioNuevo) =>{
            if (err) {
                reject(err);
            }
        });
    }

console.log("Colección de anuncios inicializada correctamente.\n");
}

// initAnuncios()
//     .then(()=>{
//     })
//     .catch(err => {
//         console.log('Hubo un error en la inicialización de los anuncios: ', err);
//         process.exit(1);
//     });

module.exports = initAnuncios;