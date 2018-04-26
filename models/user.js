const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
    name:String,
    username:String,
    email:String,
    phone:String,
    password:{type:String,bcrypt:true},
    currQuestNo:Number,
    latestScore:Number,
    timeStamp:Number
}));