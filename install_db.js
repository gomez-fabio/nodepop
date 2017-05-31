"use strict";

require('./lib/mongooseConnection');

// COMIENZO ÑAPA
const mongoose = require('mongoose');
const Anuncios = require('./models/Anuncio');
const modeloAnuncio  = mongoose.model('Anuncio');
const Usuarios = require('./models/Usuario');
const modeloUsuario  = mongoose.model('Usuario');
const sha = require('sha256');

const leerFichero = require('./init/leeFichero');

// Funcion que devuelve una promesa con la que leemos el json
function leerJsonAnuncios() {
  return new Promise((resolve, reject) => {
    leerFichero('anuncios.json', (err, initJson) => {
      if (err) {
        reject(err);
      }
      resolve(initJson);
    });
  });
}

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

    const listaAnuncios = await leerJsonAnuncios(); // leer json
    
    // cargamos lo leído del json
    for (let i = 0 ; i < listaAnuncios.anuncios.length ; i ++){
        await cargarAnuncio(listaAnuncios.anuncios[i], (err) =>{
            if (err) {
                reject(err);
            }
        });
    }
    
console.log("Colección de anuncios inicializada correctamente.\n");
}

// Funcion que devuelve una promesa con la que leemos el json
function leerJsonUsuarios() {
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

    const listaUsuarios = await leerJsonUsuarios(); // leer json

    // cargamos lo leído del json, usamos este for para poder recorrer los usuarios y hashearles la clave
    for (let i = 0 ; i < listaUsuarios.usuarios.length ; i ++){
        await cargarUsuario(listaUsuarios.usuarios[i], (err) =>{
            if (err) {
                reject(err);
            }
        });
    }

console.log("Colección de usuarios inicializada correctamente.\n");
}

// funcion asincrona para inicializar la bd
async function init(){
    await initAnuncios();
    await initUsuarios();
    console.log("Escribe ahora npm run start para iniciar.");
    process.exit(0);
}

// Capturo los errores de los init
init()
    .then(()=>{
    })
    .catch(err => {
        console.log('Hubo un error en la inicialización: ', err);
        process.exit(1);
    });