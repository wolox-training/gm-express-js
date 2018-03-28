'use strict';

const check = require('express-validator/check').check;

exports.validateAlbum = [check('externalId', 'extranlId must be an int').isInt()];
