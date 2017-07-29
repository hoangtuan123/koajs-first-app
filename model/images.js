const mongoose = require('mongoose');


const TaskSchema = mongoose.Schema = {
    height: String,
    source: String,
    width: String
}

module.exports = mongoose.model('Images', TaskSchema);