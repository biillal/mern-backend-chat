const asyncHandler = require('express-async-handler')
const apiError = require('../utilis/apiError')
const { Chat } = require('../models/chat')
const { User } = require('../models/user')
const { Message } = require('../models/message')

module.exports.accessChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.body
    console.log(userId);

    if (!userId) {
        return next(new apiError('userId param not sent with request', 401))
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    })
        .populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'latesMaessage', model: Message })

    isChat = await User.populate(isChat, {
        path: "latesMaessage.sender",
        select: "name email image -role"
    })


    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId]
        }
        const createChat = await Chat.create(chatData)
        const Fullchat = await Chat.findOne({ _id: createChat._id }).populate({ path: 'users', model: User, select: "-password" })
        res.status(201).json(Fullchat)
    }
})


module.exports.fetchChats = asyncHandler(async (req, res, next) => {
    var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'groupeAdmin', model: User, select: '-password' })
        .populate({ path: 'latesMaessage', model: Message })
        .sort({ updatedAt: -1 })
    chats = await User.populate(chats, {
        path: 'latesMaessage.sender',
        select: "username image email"
    })

    res.status(201).json(chats)
})


module.exports.createGroupChat = asyncHandler(async (req, res, next) => {

    if (!req.body.users || !req.body.name) {
        return next(new apiError('please Fill all the fields', 401))
    }
    var users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return next(new apiError('Mor than 2 users are required to form a group chat', 401))
    }
    console.log(users);
    users.push(req.user.id)
    console.log(users);

    const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupeAdmin: req.user.id
    })

    const FullGroup = await Chat.findOne({ _id: groupChat._id })
        .populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'groupeAdmin', model: User, select: '-password' })
        .populate({ path: 'latesMaessage', model: Message })
    res.status(201).json(FullGroup)

})


module.exports.renameGroup = asyncHandler(async (req, res, next) => {
    const { chatId, chatName } = req.body
    console.log({ chatId, chatName });
    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    )
        .populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'groupeAdmin', model: User, select: '-password' })


    if (!updateChat) {
        return next(new apiError('Chat Not Found', 401));
    }
    res.status(201).json(updateChat)
})


module.exports.addToGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        { new: true }
    ).populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'groupeAdmin', model: User, select: '-password' })

    if (!added) {
        return next(new apiError('Chat Not Found', 401));
    }
    res.status(201).json(added)

})
module.exports.removeFromGroupe = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        { new: true }
    ).populate({ path: 'users', model: User, select: '-password' })
        .populate({ path: 'groupeAdmin', model: User, select: '-password' })

    if (!removed) {
        return next(new apiError('Chat Not Found', 401));
    }
    res.status(201).json(removed)

})