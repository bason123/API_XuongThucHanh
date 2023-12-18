var express = require("express");
var router = express.Router();
const upload = require('../components/helper/Upload');

// upload file
// middleware upload file
// middleware: xử lý trung gian
// http://localhost:8686/upload-file
router.post('/upload-file', [upload.single('image')], async (req, res, next) =>{
  // const path = req.file.path.replace('public', '');
  const path = 'http://192.168.59.144:8686/images/' + req.file.filename;
  return res.json({path: path});
});


module.exports = router;
