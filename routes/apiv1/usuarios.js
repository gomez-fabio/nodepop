"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Usuario  = mongoose.model('Usuario');
const crypto = require('crypto');
const key = 'clavesupersecreta1234YMAYUSCULASyminusculas';
let hash = crypto.createHmac('sha256', key);

//el hash hay que llevarlo a modulo

router.post('/', (req, res, next)=>{
   const usuario = new Usuario(req.body);
    hash.update(usuario.clave)
    usuario.clave = hash.digest('hex')
    usuario.save((err, usuarioGuardado) =>{
    if (err) {
        next(err);
        return;
    }
        res.json({success: true, result: usuarioGuardado});
    });
});

module.exports = router;