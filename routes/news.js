var express = require('express');
var router = express.Router();
var newController = require('../components/news/controller');

router.get('/', async (req, res, next) =>{
    try {
        const news = await newController.getAllNews();
        return res.status(200).json(news);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.get('/:id', async (req, res, next) =>{
    try {
        const{id} = req.params;
        const news = await newController.getDetailNews(id);
        return res.status(200).json({data: news});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.get('/search/name', async (req, res, next) =>{
    try {
        const {keyword} = req.query;
        const news = await newController.getNameNews(keyword);
        return res.status(200).json(news);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.post('/', async (req, res, next) =>{
    try {
        const {body} = req;
        const news = await newController.createNews(body);
        return res.status(200).json({status: true});
    } catch (error) {
        return res.status(500).json({status: false});
    }
});

router.put('/:id', async (req, res, next) =>{
    try {
        const{id} = req.params;
        const{body} = req;
        await newController.updateNews(id, body);
        return res.status(200).json('Cập nhập thành công');
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async (req, res, next) =>{
    try {
        const {id} = req.params;
        await newController.deleteNews(id);
        return res.status(200).json({status: true});
    } catch (error) {
        return res.status(500).json({status: false});
    }
})

module.exports = router;