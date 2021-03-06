"use strict";

const fs   = require('fs');
const path = require('path');

function leeFichero(fichero, callback){   // fichero es el fichero de inicialización que estemos pasándole, anuncios o usuarios.
    const ficheroInit = path.join('./init',fichero);
    
    fs.readFile(ficheroInit, 'utf-8', (err, datos)=>{
        if (err){
            callback(err);
            return;
        };

        let initJson = {}; // Objeto vacío para almacenar el Json
        initJson = JSON.parse(datos); // Parseamos el fichero Json           

        callback(null, initJson); // el null es el error, y devolvemos el objeto.
    });
}
module.exports = leeFichero;

