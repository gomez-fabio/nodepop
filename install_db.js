"use strict";

require('./lib/mongooseConnection');

const initAnuncios = require('/init/initAnuncios');
const initUsuarios = require('/init/initUsuarios');

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