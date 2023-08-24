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
    const {username,email,password,phone} = {...req.body}
    const imageProfile = path.join(__dirname, `../images/${req.file.filename}`)

    const user = await User.create({
        username: username,
        email: email,
        password: password,
        image: imageProfile,
        phone:phone,
        role: req.body.role,
    })
    const token = createToken(user._id, user.role)
    res.status(200).json({message:'Registed succesfully' , user ,token})
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