const { getAllUsers, getSingleUser, deleteUser, updateUser } = require('../controlleurs/userControlleur')
const { protect, verifyTokenAndAdmin, verifyTokenAdminAndUser, verifyTokenAndOnlyUser } = require('../middleware/jwtMiddleware')

const router = require('express').Router()


router.route('/')
          .get(verifyTokenAndAdmin,getAllUsers)

router.route('/:id')
          .get(getSingleUser)
          .delete(verifyTokenAdminAndUser,deleteUser)
          .put(verifyTokenAndOnlyUser,updateUser)

module.exports = router