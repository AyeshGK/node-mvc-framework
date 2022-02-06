const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    roles: {
        User: { type: String, default: '_u111' },
        Admin: { type: String },
        Editor: { type: String },
    },
    password: { type: String, required: true },
    refresh_token: { type: String, },
})


module.exports = mongoose.model('User', userSchema); 