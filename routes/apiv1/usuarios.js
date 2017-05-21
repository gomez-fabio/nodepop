"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Usuario  = mongoose.model('Usuario');
const sha      = require('sha256');
const tokens   = require('../../lib/tokens');

router.post('/', (req, res, next)=>{
   const usuario = new Usuario(req.body);
    
    usuario.clave = sha.x2(usuario.clave);  
    usuario.save((err, usuarioGuardado) =>{
    if (err) {
        next(err);
        return;
    }
        res.json({success: true, result: usuarioGuardado, token: tokens.createToken(usuario)});
    });
});

router.post('/authenticate', (req, res, next)=>{
    const user = req.body;
    console.log(user.clave);
    console.log (sha.x2(user.clave));
    if(user){                      //hay usuario y pass
            Usuario.findOne({email: req.body.email}).exec((err, data)=>{
                if (err){
                    next(err);
                    return;
                }
                console.log(data);
                if (data === null){                      //no devuelve nada por ese email
                    res.sendStatus(401);
                    return;
                }
                if (data.clave !== sha.x2(user.clave)){    // tiene que coincidir usuario y pass
                    res.sendStatus(401);
                    return;
                }
                res.json({success: true, token: tokens.createToken(data)});
            });
        }
});

module.exports = router;