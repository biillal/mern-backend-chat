const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')
const apiError = require('../utilis/apiError')
const qr = require('qrcode')

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    const users = await User.find({}).skip(skip).limit(limit)
    res.status(201).json({ results: users.length, page: page, data: users })
})

module.exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new apiError(`no user for this id ${id}`, 401))
    }
    let stJson = JSON.stringify(user)
    qr.toString(stJson,{type:"terminal"},function(err,code){
        if(err) return next(new apiError(err, 401));
        console.log(code);
        res.status(201).json({user,code})
    })
    
})
module.exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return next(new apiError(`no user for this id ${id}`, 401))
    }
    res.status(201).json({ message: "deleted successfully" })
})

module.exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const {username,email,phone,role} = {...req.body}
    const user = await User.findOneAndUpdate(
        {_id:id},
        {
          username,
          email,
          phone,
          role
        })
    if (!user) {
        return next(new apiError(`no user for this id ${id}`, 401))
    }
    res.status(201).json(user)
})