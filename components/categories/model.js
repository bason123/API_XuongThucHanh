const mongoose = require('mongoose')
const {Schema} = mongoose;

const categoriSchema = new Schema({
    name:{
        type: String,//kiểu dữ liệu
        required:true,//bắt buộc phải có
        unique:true,//duy nhất
        // minLength:3,//độ dài tối thiểu
        // maxLength:50//độ dài tối đađa
    },
    description:{
        type: String,
        required:true,
    },
    // products:{
    //     type: [{
    //         _id: {type: Schema.Types.ObjectId, required: true},
    //         name: {type: String, required: true},
    //         price: {type: Number, required: true},
    //         quantity: {type: Number, required: true},
    //         images: {type: [String], required: false},
    //     }],
    //     required: false,
    // },
})
module.exports =  mongoose.model('Category', categoriSchema) || mongoose.models.Category;
// Category là 1 collection 