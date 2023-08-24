const bcrypt = require('bcrypt')
const { check } = require('express-validator')
const { User } = require('../../models/user')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.signupValidator = [
    check('username')
        .notEmpty()
        .withMessage('username is required'),
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email address')
        .custom(async value => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error(`E-mail already in use`)
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password != req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true
        }),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('password confirmation is required'),
    check('phone')
        .optional()
        .isMobilePhone("ar-DZ")
        .withMessage('invalid phone number only accepted DZ'),

    validatorMiddleware

];

exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .notEmpty()
        .withMessage('password is required'),
    validatorMiddleware
]