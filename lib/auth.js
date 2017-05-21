"use strict";

const jwt    = require('jwt-simple');
const moment = require('moment');
const config = require('./config');
const mongoose  = require('mongoose');
const Usuario   = mongoose.model('Usuario');
const sha       = require('sha256');

module.exports = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(403).send({success: false, result:'Unathorized'});
    }
    const token   = req.headers.token;
    const payload = jwt.decode(token, config.secreto);
    if(payload.exp <= moment().unix()){
        return res.status(401).send({success: false, result:'Token expired'});
    } 

    req.user = payload.sub;
    next();
}