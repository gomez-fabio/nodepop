"use strict";

const mongoose = require ('mongoose');
const conn     = mongoose.connection;

mongoose.Promise = global.Promise; // Por la advertencia de consola, del deprecation de las promesas de mongoose

// Evento error en conexión
conn.on('error', err=>{
    console.log('DB_CONN_KO\n', err);
    process.exit(1);
})

// Evento open conexión correcta
conn.once('open', ()=>{
    console.log('DB_CONN_OK\n');
})

mongoose.connect('mongodb://node:nodemola@localhost:27017/nodepop');
//mongoose.connect('mongodb://localhost:27017/nodepop');
