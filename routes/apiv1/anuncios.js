"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Anuncio  = mongoose.model('Anuncio');


const basicAuth = require('../../lib/basicAuth');

/* GET /apiv1/anuncios */

router.get('/', basicAuth, (req, res, next) => {

    // Filtros en el queryString
    const nombre = req.query.nombre;
    const venta  = req.query.venta;
    const precio = req.query.precio;
    const tags   = req.query.tags;
    const includeTotal = req.query.includeTotal;
    
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
        filter.nombre = new RegExp('^' + nombre, "i"); //case no sensitive y que comience por
    }
    
    if (venta) {
        filter.venta = venta.toLowerCase();
    }
    
    if (precio) {
        if(precio.indexOf('<') === 0 || precio.indexOf('>') === 0 || precio.includes('-')){
            if (precio.indexOf('<') === 0 && !precio.includes('-')){
                //precio menor que
                filter.precio = {'$lte':parseInt(precio.substr(1,precio.length-1))};
            }
            else if (precio.indexOf('>') === 0 && !precio.includes('-')){
                //precio mayor que
                filter.precio = {'$gte':parseInt(precio.substr(1,precio.length-1))}
            }
            else if (precio.indexOf('-')>0 && precio.indexOf('-'<precio.length)){
                //rango de precios
                const limiteInferior = precio.substr(1,precio.indexOf('-')-1);
                const limiteSuperior = precio.substr(precio.indexOf('-')+2, precio.length);
                filter.precio = {'$gte': parseInt(limiteInferior),'$lte':parseInt(limiteSuperior)};
            }
        }else{
            //precio exacto
            console.log('precio exacto', precio);
            filter.precio = precio;
        }
    }

    if (tags){
        const arrayTags = tags.toString().toLowerCase().split(","); // separamos elementos del array, el separador es ,

        filter.tags = { $in: arrayTags }; // El operador $in "matchea" los valores de un array
    }

    // if (includeTotal){

    // }

    Anuncio.list(filter,limit, skip, fields, sort, (err, listaanuncios) =>{
        if(err){
            next(err);
            return;
        }
        res.json({success: true, result: listaanuncios});
    });
});

/*lista de Tags existentes */
router.get('/tags',basicAuth,(req,res,next)=>{
     Anuncio.listaTags((err,data)=>{
            if (err){
                next(err);
                return;
            }
            res.json({success: true, result: data});
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