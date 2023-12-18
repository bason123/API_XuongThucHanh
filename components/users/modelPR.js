const mongoose = require('mongoose');
const Schema = mongoose.Schema;// định ngữ các trường và kiểu dữ liệu trong mongoose

const ModelPRSchema = new Schema(
    {
        email: {type: String, required: true},
        token: {type: String, required: true},
        created_at: {type: Date, default: Date.now},// thời gian tạo 
        status: {type: Boolean, default: true}, // trạng thái của token, 
    }
);

module.exports = mongoose.model('PasswordReset', ModelPRSchema) || mongoose.models.PasswordReset;