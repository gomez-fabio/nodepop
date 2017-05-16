"use strict";

const basicAuth = require('basic-auth');

module.exports= (req, res, next) =>{
    const user = basicAuth(req);
    
    // buscar en la bd usuario.nombre y comprobar la password

    if(!user){
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    next();
}