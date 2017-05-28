"use strict";

const mongoose = require('mongoose');
const Usuarios = require('../models/Usuario');
const modeloUsuario  = mongoose.model('Usuario');
const sha = require('sha256');

const leerFichero = require('./leeFichero');

// Funcion que devuelve una promesa con la que leemos el json
function leerJson() {
  return new Promise((resolve, reject) => {
    leerFichero('usuarios.json', (err, initJson) => {
      if (err) {
        reject(err);
      }
      resolve(initJson);
    });
  });
}

// Función que devuelve una promesa con la que cargamos el usuario
function cargarUsuario(usuarioNuevo){
    return new Promise((resolve, reject) =>{
        const usuario = new modeloUsuario(usuarioNuevo);

        usuario.clave = sha.x2(usuario.clave);        
        usuario.save(usuarioNuevo, (err, cargado) =>{
            if (err) {
                reject(err);
            }
            resolve(cargado);
        });
    });
}

// funcion ppal, borramos usuarios, leemos fichero json y cargamos lo leido
async function initUsuarios(){

    // Borramos el contenido de la colección 
    await Usuarios.remove({}, (err) => {
        if (err) {
            reject(err);
        }
    });

    const listaEnJson = await leerJson(); // leer json

    // cargamos lo leído del json, usamos este for para poder recorrer los usuarios y hashearles la clave
    for (let i = 0 ; i < listaEnJson.usuarios.length ; i ++){
    //    await cargarUsuario(listaEnJson.usuarios[i], (err, usuarioNuevo) =>{
        await cargarUsuario(listaEnJson.usuarios[i], (err) =>{
            if (err) {
                reject(err);
            }
        });
    }

    // // cargamos lo leído del json
    // await Usuarios.insertMany(listaEnJson.usuarios, (err) =>{
    //     if (err){
    //         reject(err);
    //     }
    // });

console.log("Colección de usuarios inicializada correctamente.\n");
}

module.exports = initUsuarios;