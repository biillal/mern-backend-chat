const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is true"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "email is true"],
        minLength: [6, 'Too short password']
    },
    passwordChangeAt: Date,
    image: {
        type: Object,
        default: {
            url: "https://pixabay.com/static/img/profile_image_dummy.svg",
            publucId: null
        }
    },
    address: {
        type: String
    },
    phone: {
        type: Number
    },
    role: {
        type: Boolean,
        default: "false"
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = {
    User
}