const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') 
const { hashPassword } = require('../helpers/bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username must be filled"],
        minlength: [4, "Your username needs to be at least 5 letters"],
        unique: [true, "This username is already registered"]
    },
    password: {
        type: String,
        required: [true, "Password must be filled"],
        minlength: [4, "Your password needs to be at least 5 letters"]
    },
    email: {
        type: String,
        required: [true, "Email must be filled"],
        unique: [true, "This email is already registered"],
        validate: [
            {
                validator: function(value) {
                  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
                },
                message: 'Invalid email format'
            }
        ]
    }
})

userSchema.pre('save', function(next){
    this.password = hashPassword(this.password)
    next()
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema)

module.exports = User