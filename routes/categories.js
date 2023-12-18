var express = require('express');
var router = express.Router();
const controllerModel = require('../components/categories/controller')
// http://localhost:3000/categories
// 1. lấy danh sách categories
// method: Get
router.get('/', async (req, res, net) =>{
    try {
        const categories = await controllerModel.getAllCategories();
        return res.status(200).json(categories);
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error.message});
    }
});

// http://localhost:3000/categories/1
// 2. lấy chi tiết danh mục
// method: Get
router.get('/:id', async (req, res, net) => {
    try {
        const {id} = req.params;
        const categories = await controllerModel.getCategoryById(id);
        return res.status(200).json(categories);
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error.message})
    }
});

// http://localhost:3000/categories
// 3. Thêm mới 1 danh mục
// method: post
router.post('/', async (req, res, net) => {
    try {
        const {body} = req;
        await controllerModel.createCategory(body);
        return res.status(200).json({message: 'thêm mới thành công'});
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error.message})
    }
});


// http://localhost:3000/categories
// 4. cập nhập 1 categories
// method: put
router.put('/:id', async (req, res, net) =>{
    try {
        const {id} = req.params;
        const {body} = req;
        await controllerModel.updateCategory(id, body);
        return res.status(200).json({message: 'cập nhập thành công'})
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error.message})
    }
})

// http://localhost:3000/categories
// 5. xóa 1 categories
// method: detele
router.delete('/:id', async (req, res, net) =>{
    try {
        const {id} = req.params;
        await controllerModel.deteleCategory(id);
        return res.status(200).json({status: true})
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({status: true})
    }
})


module.exports = router;