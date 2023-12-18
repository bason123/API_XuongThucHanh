const jwt = require('jsonwebtoken');
// đọc token từ header của api
const checkToken = (req, res, next) =>{
    try {
        // lấy token từ header
        const token = req.headers['authorization'].split(' ')[1];
        if(!token) {
            throw new Error('No token  provided');
        }else{
            // kiểm tra token, đúng token, đúng key, hạn sử dụng token
            jwt.verify(token, 'yeuban', (err, decoded) =>{
                if(err){
                    throw new Error('Unauthorized')
                }else{
                    // lưu thông tin giả mã được vào đối tượng req, dùng cho các xử lý
                    req.user = decoded;
                    next();  
                }
            });
        }
    } catch (error) {
        console.log("checkToken error: ", error);
        return res.status(401).json({error: "Unauthorized"});
    }
}

module.exports = checkToken;