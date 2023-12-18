const UserModel = require('../users/model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mailer = require('../../components/helper/Mailer')
const PasswordResetModel = require('../../components/users/modelPR')
// đăng ký tài khoản
const register = async (data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {email, name, address, phone, avatar, password ,role, dob, created_at} = data;
        // tìm tài khoản trong db có email
        // mã hóa tài khoản
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new UserModel({
            email,
            name,
            address,
            password: hash,
            phone,
            avatar,
            role,
            dob,
            created_at,
            isVerified: false
        });
        await user.save();
        // gửi email xác thực tài khoản
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject: 'Xác thực tài khoản',
                content: `<a href="http://localhost:3000/verify/${user._id}">Click vào đây</a>`
            })
        }, 0)
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi đăng ký');
    }
}

// đăng nhập tài khoản
const login = async (data) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {email, password} = data;
        // tìm tài khoản trong db có email
        let user = await UserModel.findOne({email});
        if(!user) throw new Error('Không tìm thấy tài khoản');
        // kiểm tra password
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("ahihih",  password);
        if(!isValidPassword) throw new Error('Nhập mật khẩu không đúng');
        // xóa field password trong user
        user.password = undefined;
        // tao token su dung jwt 
        const token = jwt.sign(
            {_id: user._id, email: user.email, role: user.role}, // lưu gì 
            'yeuban', //cái key mình muốn lưu
            {expiresIn:'1h'});
            user = {...user._doc, token};
        return user;
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi đăng nhập');
    }
}

//cập nhập thông tin tài khoản
const updateProfile = async (id, data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {name, address, phone, avatar, dob} = data;
        const users = await UserModel.findById(id);
        if(!users) throw new Error('Không tìm người dùng');
        users.name = name || users.name;
        users.address = address || users.address;
        users.phone = phone || users.phone;
        users.avatar = avatar || users.avatar;
        users.dob = dob || users.dob;
        await users.save();
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi cập nhập thông tin người dùng');
    }
}

// đổi mật khẩu
const changedPassword = async (id, data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {password} = data;
        const user = await UserModel.findById(id);
        if(!user) throw new Error('Không tìm thấy người dùng');
        user.password = password || user.password
        await user.save();
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi cập nhập mật khẩu');
    }
}

//quên mật khẩu
const forgotPassword = async (email) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // tim user theo email
        const user = await UserModel.findOne({email})
        if(!user) throw new Error('Không tìm thấy người dùng');
        // tạo token
        const token = jwt.sign(
            {_id: user._id, email: user.email},
            'ahihi',
            {expiresIn: 60 * 60 * 1000}
        );
        // lưu token và email vào db
        const passwordReset = new PasswordResetModel({email, token});
        await passwordReset.save();
        // gửi email khôi phục mật khẩu
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject:'Khôi phục mật khẩu',
                content:`Link khôi phục mật khẩu: http://localhost:3000/reset-password/${token}`
            })
        }, 0);
        return true;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
}

// xem danh sách tài khoản
const getAllUser =  () =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
}

// check token reset password
const checkTokenResetPassword = async (token) =>{
    try {
        const decoded = jwt.verify(token, 'ahihi');
        if(decoded){
            const {email} = decoded;
            const passwordReset = await PasswordResetModel.findOne({
                email,
                token,
                status: true,
                created_at: {$gte: new Date(Date.now() - 60 * 60 * 1000)}
            });
            if(passwordReset) return true;
            return false;
        }
        return false;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
};

// reset password
const resetPassword = async (token, password) =>{
    try{
        const decode = jwt.verify(token, 'ahihi');
        if(!decode) throw new Error('Không tìm thấy người dùng');
        const {email} = decode;
        const passwordReset = await PasswordResetModel.findOne({
            email,
            token,
            status: true,
            created_at: {$gte: new Date(Date.now() - 60 * 60 * 1000)}// $gte hơn hơn hoặc bằng
        });
        if(!passwordReset) throw new Error('Token không hợp lệ');

        // mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        // lưu vào db mật khẩu mới
        const user = await UserModel.findOne({email});
        user.password = hashPassword;
        await user.save();
        // xóa token
        await PasswordResetModel.updateOne({email, token},{status: false});
        return true; 
    }catch (error) {
        console.log(error);
        return false;
    }
}

// xem chi tiết tài khoản
const getUserById = async (id) =>{
    //lấy dữ liệu từ database
    //trả về dữ liệu cho client
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        console.log("error: ", error);
        throw new Error('Xảy ra lỗi khi lấy chi tiết thông tin người dùng');
    }
}

// tìm kiếm tài khoản
const searchUser = () =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    return [];
}

// khóa tài khoản
const lockUser = () =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    return {};
}

// mở tài khoản
const unLockUser = () => {
    // lấy dữ liệu cho client
    // trả về dữ liệu cho client
    return {};
}


// game nâng cao
const updateLevel = async (id, data) =>{
    try {
        const {level} = data;
        const user = await UserModel.findById(id);
        if(!user) throw new Error('Không tìm thấy người chơi');
        user.level = level;
        await user.save();
    } catch (error) {
        console.log(error);
    }
}

// xác thực tài khoản
const verify = async (id) =>{
    try {
        const user = await UserModel.findById(id);
        if(!user) throw new Error('Không tìm thấy tài khoản');
        if(user.isVerified) throw new Error('Tài khoản đã xác thực');
        user.isVerified = true;
        await user.save();
        return true;
    } catch (error) {
        console.log("create error: ", error);
        return false;
    }
}

//quên mật khẩu
const forgotPasswordAPP = async (email) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // tim user theo email
        const user = await UserModel.findOne({email})
        if(!user) throw new Error('Không tìm thấy người dùng');
        // tạo token
        const token = Math.floor(Math.random() * 9000) + 1000;
        // lưu token và email vào db
        const passwordReset = new PasswordResetModel({email, token});
        await passwordReset.save();
        // gửi email khôi phục mật khẩu
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject:'Khôi phục mật khẩu',
                content: `Mã otp của bạn là: ${token}`
            })
        }, 0);
        return true;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
}

// check token reset password
const checkOTP = async (otp) =>{

    try {
            const passwordReset = await PasswordResetModel.findOne({token : otp});
            if(passwordReset) return true;
            return false;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
};

// reset password
const resetPasswordAPP = async (token, password) =>{
    try{

        console.log("okelo", token,password)
        // mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        // lưu vào db mật khẩu mới
        const passwordReset = await PasswordResetModel.findOne({token : token});
        const email = passwordReset.email;
        const user = await UserModel.findOne({email});
        user.password = hashPassword;
        await user.save();

        setTimeout(async () =>{
            try {
                const result = await PasswordResetModel.findByIdAndDelete(email);
                return result;
            } catch (error) {
                console.log("error", error);
            }
        }, 1000);
        
        // xóa token
        // await PasswordResetModel.updateOne({email, token},{status: false});
        return true; 
    }catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    register,
    login,
    updateProfile,
    changedPassword,
    forgotPassword,
    getAllUser,
    searchUser,
    lockUser,
    unLockUser,
    updateLevel, 
    verify,
    checkTokenResetPassword, 
    resetPassword,
    getUserById,
    forgotPasswordAPP,
    checkOTP,
    resetPasswordAPP,
}