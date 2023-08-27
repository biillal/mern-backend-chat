const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')
const apiError = require('../utilis/apiError')
const qr = require('qrcode')
const { cloudinarayRemoveImage, cloudinarayUploadImage } = require('../utilis/cloudinary')
const fs = require('fs')
const path = require('path')
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
    res.status(201).json(user)

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

module.exports.searchusers = asyncHandler(async(req,res,next)=>{
    const keyword = req.query.search ? {
        $or:[
            {username:{$regex:req.query.search ,$options:"i"}},
            {email:{$regex:req.query.search ,$options:"i"}},
        ]
    } 
    : {}
    const users = await User.find(keyword).find({_id:{$ne:req.user.id}})
    res.status(201).json(users)
})


module.exports.profilePhotoUploadCntr = asyncHandler(async (req, res) => {
    //1-validation
    if (!req.file) {
        res.status(400).json({ message: "no file provided" })
    }
    console.log(req.file);
    // 2. get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)

    // 3. upload to cloudinaray
    const result = await cloudinarayUploadImage(imagePath)

    // 4. get the user from DB
    const user = await User.findById(req.user.id)


    // 5. delete the old profile photo if exist
    if (user.image.publicId !== null) {
        await cloudinarayRemoveImage(user.image.publicId)
    }
    // 6. change the profilephoto field in the DB 
    user.image = {
        url: result.secure_url,
        publucId: result.public_id
    }
    await user.save()

    // 7.send response to client
    res.status(200).json({
        message: "your profile photo uploaded successfully",
        image: { url: result.secure_url, publicId: result.public_id }
    })
    //8.Remove image from the server
    fs.unlinkSync(imagePath)
})
