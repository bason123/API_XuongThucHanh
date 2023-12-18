// controller để tương tác với db
const CategoryModel = require('./model')

// lấy danh sách các thư mục
const getAllCategories = async () =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // select * from categories
        const categories = await CategoryModel.find({});
        //select name from categories
        // const categories = await CategoryModel.find({}, 'name');
        //select name, description from categories where name like /%a%/
        //const categories = await CategoryModel.find({name: /a/, description: /a/}, 'name description');
        return categories;
    } catch (error) {
        console.log('getAllCategories: ', error);
        throw new Error('Có lỗi xảy ra khi lấy danh sách categories')
    }
}

//lấy chi tiết danh mục
const getCategoryById = async (id) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // select * from categories where id = id;
        const categories = await CategoryModel.findById(id);
        return categories;
    } catch (error) {
        console.log('getCategoryById: ', error);
        throw new Error('Có lỗi xảy ra khi lấy chi tiết danh mục')
    }
    
}

// thêm mới 1 danh mục
const createCategory = async (data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {name, description} = data;
        const categories = new CategoryModel({ name , description});
        await categories.save();
    } catch (error) {
        console.log('createCategory: ', error);
        throw new Error('Có lỗi xảy ra khi thêm mới 1 danh mục')
    }
}

// cập nhập 1 danh mục
const updateCategory = async (id, data) => {
    try {
         const {name, description} = data;
         const categories = await CategoryModel.findById(id);
         if(categories){
            categories.name = name;
            categories.description = description;
            await categories.save();
         }
    } catch (error) {
        console.log('updateCategory: ', error);
        throw new Error('Có lỗi xảy ra khi cập nhập 1 danh mục');
    }
}

//xóa danh mục
const deteleCategory = async (id) => {
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const categories = await CategoryModel.findByIdAndDelete(id);
       return categories;
    } catch (error) {
        console.log('deteleCategory: ',error);
        throw new Error('Có lỗi xảy ra khi xóa 1 danh mục')
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deteleCategory,
    
}
