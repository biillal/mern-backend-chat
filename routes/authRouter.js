const { signup, login } = require('../controlleurs/authControlleur')
const upload = require('../middleware/uploadPhoto')
const { signupValidator, loginValidator } = require('../utilis/validators/authValidator')

const router = require('express').Router()


router.post('/signup',upload.single('image'),signupValidator,signup)
router.post('/login',loginValidator,login)

module.exports = router