"use strict";

require('./lib/mongooseConnection');

const initAnuncios = require('./init/initAnuncios');
//const initUsuarios = require('./init/initUsuarios');

// funcion asincrona para inicilizar la bd, devuelve una promesa
async function init(){
    await initAnuncios();
    //await initUsuarios();
    process.exit(0);
}

// proceso la promesa del init
init().then(()=>{})
    .catch(err => {
        console.log('Hubo un error en la inicialización: ', err);
    });