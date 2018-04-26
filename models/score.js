const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Score', new Schema({
    userId:String,
    currQuestNo:Number,
    latestScore:Number
}));

