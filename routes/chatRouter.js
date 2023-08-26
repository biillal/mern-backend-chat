const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroupe } = require('../controlleurs/chatControlleur')
const { verifyToken } = require('../middleware/jwtMiddleware')

const router = require('express').Router()



router.route("/").post(verifyToken,accessChat)
router.route("/").get(verifyToken,fetchChats)
router.route("/group").post(verifyToken,createGroupChat)
router.route("/rname").put(verifyToken,renameGroup)
router.route("/groupadd").put(verifyToken,addToGroup)
router.route("/groupremove").put(verifyToken,removeFromGroupe)



module.exports = router