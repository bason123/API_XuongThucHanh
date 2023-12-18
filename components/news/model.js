const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectID = Schema.ObjectId;

const newsSchema = new Schema({
    title:{type: String, required: true, },
    content:{type: String, required: true},
    image:{type: String, required: true},
    createdAt:{type: String, default: Date.now},
    user_id:{type: ObjectID, ref:'User'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    category_id:{type: ObjectID, required: true, ref:'Category'}

});

module.exports = mongoose.model('New', newsSchema) || mongoose.models.New;