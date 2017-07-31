const mongoose = require('mongoose');


const TaskSchema = mongoose.Schema = {
    username: String,
    password: String,
    serectkey: String,
    admin: Boolean
}

module.exports = mongoose.model('Users', TaskSchema);