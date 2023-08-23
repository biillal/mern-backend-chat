const asyncHandler = require('express-async-handler')
const path = require('path')
const { User } = require('../models/user')
const apiError = require('../utilis/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const qr = require('qrcode')

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPAIR_KEY
    })
}

module.exports.signup = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        next(new apiError('file is required', 400))
    }
    const imageProfile = path.join(__dirname, `../images/${req.file.filename}`)

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        image: imageProfile,
        phone:req.body.phone,
        role: req.body.role,
    })
    res.status(200).json({ user })
})



module.exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    console.log(user);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new apiError('Incorrect email or password', 401))
    }
    const token = createToken(user._id, user.role)
    res.status(201).json({ message: 'logged in successfully', user, token })
})