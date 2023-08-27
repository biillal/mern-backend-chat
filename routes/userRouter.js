const { getAllUsers, getSingleUser, deleteUser, updateUser, searchusers, profilePhotoUploadCntr } = require('../controlleurs/userControlleur')
const { protect, verifyTokenAndAdmin, verifyTokenAdminAndUser, verifyTokenAndOnlyUser, verifyToken } = require('../middleware/jwtMiddleware')
const upload = require('../middleware/uploadPhoto')

const router = require('express').Router()


router.route('/')
    .get(getAllUsers)

router.route('/search').get(searchusers)

router.route('/:id')
    .get(verifyTokenAdminAndUser, getSingleUser)
    .delete(verifyTokenAdminAndUser, deleteUser)
    .put(verifyTokenAndOnlyUser, updateUser)
router.route('/profile/profile-photo-upload')
    .post(verifyToken, upload.single("image"), profilePhotoUploadCntr)
module.exports = router