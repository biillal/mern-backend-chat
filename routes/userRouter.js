const { getAllUsers, getSingleUser, deleteUser, updateUser, searchusers } = require('../controlleurs/userControlleur')
const { protect, verifyTokenAndAdmin, verifyTokenAdminAndUser, verifyTokenAndOnlyUser } = require('../middleware/jwtMiddleware')

const router = require('express').Router()


router.route('/')
          .get(getAllUsers)
        
router.route('/search').get(searchusers)

router.route('/:id')
          .get(verifyTokenAdminAndUser,getSingleUser)
          .delete(verifyTokenAdminAndUser,deleteUser)
          .put(verifyTokenAndOnlyUser,updateUser)

module.exports = router