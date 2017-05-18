"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Anuncio  = mongoose.model('Anuncio');


const basicAuth = require('../../lib/basicAuth');

//router.use(basicAuth)

/* GET /apiv1/anuncios */
// Para recuperar la lista de anuncios
router.get('/', basicAuth, (req, res, next) => {
//router.get('/', (req, res, next) => {    
    // Filtros en el queryString
    const nombre = req.query.nombre;
    const venta  = req.query.venta;
    const precio = req.query.precio;
    const tags   = req.query.tags;
    
    const filter = {};
    
    // Parámetros de la búsqueda
    const limit  = parseInt(req.query.limit);
    const skip   = parseInt(req.query.skip);
    //const fields = null;s
    //const fields = req.query.fields;
    //const fields = {nombre: 1, venta:1, precio:1, foto:1, tags:1 };
    const fields = {_id: 0, __v: 0};
    const sort   = req.query.sort;

    

    if (nombre) {
        filter.nombre = nombre;
    }
    
    if (venta) {
        filter.venta = venta;
    }
    
    if (precio) {
        filter.precio = precio;
    }

    if (tags){
        filter.tags = tags;
    }

    Anuncio.list(filter,limit, skip, fields, sort, (err, listaanuncios) =>{
        if(err){
            next(err);
            return;
        }
        res.json({success: true, result: listaanuncios});
    });
});

/* POST /apiv1/anuncios */
// Para añadir un anuncio
// router.post('/', (req,res,next) =>{
//     //console.log(req.body);
//     const anuncio = new Anuncio(req.body);
//     anuncio.save((err, anuncioGuardado) =>{
//         if (err) {
//             next(err);
//             return;
//         }
//         res.json({success: true, result: anuncioGuardado});
//     });
// });



module.exports = router;