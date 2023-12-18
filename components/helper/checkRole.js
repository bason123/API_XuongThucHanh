const checkRoleAdmin = async (req, res, next) =>{
    try {
        const {user} = req;
        if(user.role < 3){
            throw new Error('Bạn không có quyền truy cập');
        }
        next();
    } catch (error) {
        console.log('CheckRole error: ', error);
        return res.status(401).json({error: 'Unauthorized', message: 'Bạn không có quyền truy cập'});
    }
}

const checkRoleManager = async (req, res, next) =>{
    try {
        const {user} = req;
        if(user.role < 2){
            throw new Error('Bạn không có quyền truy cập');
        }
        next();
    } catch (error) {
        console.log('CheckRole error: ', error);
        return res.status(401).json({error: 'Unauthorized', message: 'Bạn không có quyền truy cập'});
    }
}

module.exports = {checkRoleAdmin, checkRoleManager};