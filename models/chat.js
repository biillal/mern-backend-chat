const mongoose = require('mongoose')

const chatModel = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latesMaessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupeAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

const Chat = mongoose.model('chat',chatModel)

module.exports = {
    Chat
}