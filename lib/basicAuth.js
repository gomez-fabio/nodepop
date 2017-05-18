"use strict";

const basicAuth = require('basic-auth');
const mongoose = require('mongoose');
const Usuario  = mongoose.model('Usuario');
const crypto = require('crypto');
const key = 'clavesupersecreta1234YMAYUSCULASyminusculas';
let   hash = crypto.createHmac('sha256', key);

//el hash hay que llevarlo a modulo

module.exports = (req,res,next) =>{
    const user = basicAuth(req);
    if(!user) {                            //no usuario/pass
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    } else if(user){                      //hay usuario y pass
        // console.log(user.name);
        // console.log(user.pass);
        Usuario.buscaEmailUsario(user.name, (err,data)=>{    //llamo al metodo estático del modelo
            if (err){
                return;
            }
            if (data[0] === undefined){                      //no devuelve nada por ese email
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                res.sendStatus(401);
                return;
            }
            hash.update(user.pass);
            user.pass = hash.digest('hex');
            // console.log(user.name);
            // console.log(data[0].email)
            // console.log(user.pass);
            // console.log(data[0].clave);
            if (data[0].email !== user.name || data[0].clave !== user.pass){    // tiene que coincidir usuario y pass
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                res.sendStatus(401);
                return;
            }                
        });
        // al siguiente middleware
        next();
    }
    
};