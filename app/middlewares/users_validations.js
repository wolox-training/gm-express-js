'use strict';

const { check, oneOf } = require('express-validator/check');

exports.validateUser = [
  check('password', 'passwords must be at least 8 chars long').isLength({ min: 8 }),
  check('email', 'email must be an email valid and from wolox')
    .isEmail()
    .matches(/[\w\.]+@wolox.com.ar/),
  check('firstName', 'fisrtName not present').isLength({ min: 1 }),
  check('lastName', 'lastName not present').isLength({ min: 1 })
];

exports.validateEmail = [
  check('email', 'email must be an email valid and from wolox')
    .isEmail()
    .matches(/[\w\.]+@wolox.com.ar/)
];

exports.validateAdmin = oneOf(
  [
    [
      check('password', 'passwords must be at least 8 chars long').isLength({ min: 8 }),
      check('email', 'email must be an email valid and from wolox')
        .isEmail()
        .matches(/[\w\.]+@wolox.com.ar/),
      check('firstName', 'fisrtName not present').isLength({ min: 1 }),
      check('lastName', 'lastName not present').isLength({ min: 1 })
    ],
    check('email', 'email must be an email valid and from wolox')
      .isEmail()
      .matches(/[\w\.]+@wolox.com.ar/)
  ],
  'Parameters to set an admin invalid'
);
