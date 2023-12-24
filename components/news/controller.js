const newsModel = require('./model');

// lấy danh sách bài viết
const getAllNews = async () =>{
    try {
        const news = await newsModel.find({});
        return news;
    } catch (error) {
        console.log("error :", error);
        throw new Error('Xảy ra lỗi khi lấy danh sách tin tức')
    }
};

// lấy thông tin chi tiết 1 bài viết
const getDetailNews = async (id) =>{
    try {
        const news = await newsModel.findById(id);
        return news;
    } catch (error) {
        console.log("error :", error);
        throw new Error('Xảy ra lỗi khi lấy chi tiết tin tức')
    }
};

// Tìm kiếm bài viết theo tên 
const getNameNews = async (keyword) =>{
    try {
        const news = await newsModel.find({title: new RegExp(keyword, "i")});
        return news;
    } catch (error) {
        console.log("error :", error);
        throw new Error('Xảy ra lỗi khi tìm kiếm tin tức');
    }
};

// thêm bài viết mới
const createNews = async (data) =>{
    try {
        const {title, content, image, category_id} = data;
        const news = new newsModel({
            title,
            content,
            image,
            category_id,
        });
        await news.save();
    } catch (error) {
        console.log("error :",error);
        throw new Error('Xảy ra lỗi khi thêm bài viết mới');
    }
}

// xóa bài viết
const deleteNews = async (id) =>{
    try {
        const news = await newsModel.findByIdAndDelete(id);
        return news;
    } catch (error) {
        console.log("error :", error);
        throw new Error('Xảy ra lỗi khi xóa bài viết');
    }
};

const updateNews = async (id, data) =>{
    try {
        const {title, content, image, category_id} = data;
        console.log(id, title)
        const news = await newsModel.findById(id);
        if(!news) throw new Error('Không tìm thấy sản phẩm');
        news.title = title || news.title;
        news.content = content || news.content;
        news.image = image || news.image;
        news.category_id = category_id || news.category_id
        await news.save();
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi cập nhập sản phẩm');
    }
}

module.exports = {
    getAllNews,
    createNews,
    getNameNews,
    getDetailNews,
    deleteNews,
    updateNews,

}