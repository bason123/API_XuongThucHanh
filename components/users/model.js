const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email:{type:String, required:true, unique:true},
    name:{type:String, required:false},
    address:{type:String, required:false},
    password:{type:String, required:true},
    phone:{type:String, required:false},
    avatar:{type:String, required:false},
    // phone:{type:String, required:true},
    role:{type:Number, },
    isVerified: {type: Boolean, default: false}, // xác thực tài khoản
    dob: {type: String, required:false},
    // age:{type:Number, required:true},
    // gender:{type:String, required:true},
    // level:{type:Number, required:false},
    // resetToken:{type:String},
    // resetTokenExpiration:{type:Number}
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    // created_by: {type: ObjectID, required: true, ref: 'User'},
    // updated_by: {type: ObjectID, required: true, ref: 'User'},

})

module.exports = mongoose.model('User', userSchema) || mongoose.models.User;