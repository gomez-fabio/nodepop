"use strict";

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');

function createToken (usuario) {
  const payload = {
    sub: usuario._id,
    iat: moment().unix(),
    exp: moment().add(15, 'minutes').unix()
  };

  return jwt.encode(payload, config.secreto);
}

function decodeToken (token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.secreto);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado'
        });
      }
      resolve(payload.sub);
    } catch (err) {
      reject({
        status: 500,
        message: 'Token no válido'
      });
    }
  });

  return decoded;
}

module.exports = {
  createToken,
  decodeToken
};