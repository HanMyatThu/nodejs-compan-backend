const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema =  new Schema({
    name: {
        type: String,
        default: ''
    },
    facebookId: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
