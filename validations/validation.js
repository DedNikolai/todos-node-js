import {body} from 'express-validator';

export const registerValidation = [
    body('firstName', 'FirstName to short').isLength({min: 2}).isString(),
    body('lastName', 'LastName to short').isLength({min: 2}).isString(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password to short').isLength({min: 5}),
];

export const userValidation = [
    body('firstName', 'FirstName to short').isLength({min: 2}).isString(),
    body('lastName', 'LastName to short').isLength({min: 2}).isString(),
    body('email', 'Invalid email').isEmail(),
    body('avatarUrl', 'Invalid URL').optional().isString(),
];

export const loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password to short').notEmpty()
];

export const todoCreateValidation = [
    body('text', 'Invalid text').isLength({min: 5}).isString(),
    body('todoDate', 'Invalid Date').isISO8601()
];

