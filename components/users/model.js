const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email:{type:String, required:true, unique:true},
    name:{type:String, required:false},
    address:{type:String, required:false},
    password:{type:String, required:true},
    phone:{type:String, required:false},
    avatar:{type:String, required:false},
    Country:{type:String, default:null},
    role:{type:Number, required:false},
    isVerified: {type: Boolean, default: false}, // xác thực tài khoản
    dob: {type: String, required:false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    // created_by: {type: ObjectID, required: true, ref: 'User'},
    // updated_by: {type: ObjectID, required: true, ref: 'User'},

})

module.exports = mongoose.model('User', userSchema) || mongoose.models.User;