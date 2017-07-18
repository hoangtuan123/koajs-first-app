const mongoose = require('mongoose');


const TaskSchema = mongoose.Schema = {
    name:String,
    urgency: String
}

module.exports = mongoose.model('Task', TaskSchema);