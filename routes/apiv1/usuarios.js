"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Usuario  = mongoose.model('Usuario');
const sha      = require('sha256');

//el hash hay que llevarlo a modulo

router.post('/', (req, res, next)=>{
   const usuario = new Usuario(req.body);
    
    usuario.clave = sha.x2(usuario.clave);  
    usuario.save((err, usuarioGuardado) =>{
    if (err) {
        next(err);
        return;
    }
        res.json({success: true, result: usuarioGuardado});
    });
});

module.exports = router;