"use strict";

const basicAuth = require('basic-auth');
const mongoose  = require('mongoose');
const Usuario   = mongoose.model('Usuario');
const sha       = require('sha256');

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
            // console.log(user.name);
            // console.log(user.pass);
            // console.log(sha.x2(user.pass));
            // console.log(data[0].clave);
            if (data[0].clave !== sha.x2(user.pass)){    // tiene que coincidir usuario y pass
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                res.sendStatus(401);
                return;
            }
            next();  // al siguiente middleware          
        });
    }
};