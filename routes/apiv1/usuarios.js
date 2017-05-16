"use strict";

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Usuario  = mongoose.model('Usuario');

router.post('/', (req, res, next)=>{
   const usuario = new Usuario(req.body);
    usuario.save((err, usuarioGuardado) =>{
    if (err) {
        next(err);
        return;
    }
        res.json({success: true, result: usuarioGuardado});
    });
});

module.exports = router;