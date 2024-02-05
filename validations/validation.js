import {body} from 'express-validator';

export const registerValidation = [
    body('firstName', 'FirstName to short').isLength({min: 2}).isString(),
    body('lastName', 'LastName Name to short').isLength({min: 2}).isString(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password to short').isLength({min: 5}),
    body('avatarUrl', 'Invalid URL').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password to short').isLength({min: 5}),
];

export const todoCreateValidation = [
    body('text', 'Invalid text').isLength({min: 5}).isString(),   
];

