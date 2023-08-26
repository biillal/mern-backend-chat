const mongoose = require('mongoose')

const messageModel = mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    content: {
        type:String,
        trim:true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, { timestamps: true })

const Message = mongoose.model('message', messageModel)

module.exports = {
    Message
}