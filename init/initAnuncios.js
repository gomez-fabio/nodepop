"use strict";

const mongoose = require('mongoose');
const Anuncio = require('../models/Anuncio');
//const Anuncio  = mongoose.model('Anuncio');

const leerFichero = require('./leeFichero');

// Funcion que devuelve una promesa con la que leemos los anuncios
function leerAnuncios(){
    return new Promise((resolve, reject) =>{
        Anuncio.find().exec((err, lista) => {
            if(err){
                reject(err);
            }
            resolve(lista);
        });
    });
}

// Funcion que devuelve una promesa con la que borramos los anuncios
function borrarAnuncios(idAnuncio) {
  return new Promise((resolve, reject) => {
    Anuncio.remove({ _id: idAnuncio }, (err, borrado) => {
      if (err) {
        reject(err);
      }
      resolve(borrado);
    });
  });
}

// Funcion que devuelve una promesa con la que leemos el json
function leerJson() {
  return new Promise((resolve, reject) => {
    leerFichero('initAnuncios.json', (err, initJson) => {
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
        const anuncio = new modelAnuncio(anuncioNuevo);

        anuncio.save(anuncioNuevo, (err, cargado) =>{
            if (err) {
                reject(err);
            }
            resolve(cargado);
        });
    });
}

// funcion ppal, leemos de bd, borramos lo leido, leemos fichero json y cargamos lo leido
async function initAnuncios(){

    const lista = {}

    lista = await leerAnuncios(); // leer de bd

    // borramos lo leido
    for (let i = 0 ; i < lista.length; i++){
        await borrarAnuncios(lista[i]._id, (err, borrado) => {
            if (err) {
                reject(err);
            }
        });
    }

    lista = await leerJson(); // leer json

    for (let i = 0 ; i < lista.anuncios.length ; i ++){
        await cargarAnuncio(lista.anuncios[i], (err, anuncioNuevo) =>{
            if (err) {
                reject(err);
            }
        });
    }

}

module.exports = initAnuncios;
