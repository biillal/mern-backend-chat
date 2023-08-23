const asyncHandler = require('express-async-handler');
const apiError = require('../utilis/apiError');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken')
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            const decodedPayload = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decodedPayload
            console.log(req.user);
            next()
        } catch (error) {
            return next(new apiError('Invalid token, access denied',401))
        }
    } else {
        return next(new apiError('no token provided, access denied',401))
    }
}

// verify token && only user himeself
function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id){
            next()
        }else{
            return next(new apiError('not allowed , only user hime self',401))
        }
    })
}

function verifyTokenAdminAndUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.role === "admin"){
            next()
        }else{
            return next(new apiError('not allowed , only user hime self and admin',401))
        }
    })
}
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        console.log("aa");

        if(req.user.role){
            console.log("faa");

            next()
        }else{
            return next(new apiError('not allowed , only admin',401))
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndOnlyUser,
    verifyTokenAdminAndUser,
    verifyTokenAndAdmin
}