const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Question', new Schema({
    theQuestion: String,
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    theAnswer:String
}));