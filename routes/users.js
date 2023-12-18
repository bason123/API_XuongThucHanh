// import "bootstrap/dist/css/bootstrap.min.css";
var express = require('express');
var router = express.Router();
const UserController = require('../components/users/controller')
const UserModel = require('../components/users/model')
const checkToken = require('../components/helper/checkToken');
const checkRole = require('../components/helper/checkRole')

// đăng ký
//http://localhost:3000/users
// method: post
router.post('/register', async (req, res, next) => {
  try {
    const {body} = req;
    await UserController.register(body);
    return res.status(200).json({status: true});
  } catch (error) {
    return res.status(500).json({status: false, error: error});
  }
});


// đăng nhập
//http://localhost:3000/users
// method: post
router.post('/login', async (req, res, next) =>{
  try {
    const {body} = req;
    const user = await UserController.login(body);
    return res.status(200).json({data: user});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


// Xác thực tài khoản
//http://localhost:8686/users/verify/:id
// method: post
router.post('/verify/:id', async (req, res, next) =>{
  try {
    const {id} = req.params;
    const result = await UserController.verify(id);
    return res.status(200).json({status: result});
  } catch (error) {
    return res.status(500).json({status: false, error: error.message});
  }
});


router.post('/forgetPassword', async (req, res, next) =>{
  try {
    const {email} = req.body;
    const result = await UserController.forgotPassword(email);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
});

router.post('/check-token-reset-password', async (req, res, next) =>{
  try {
    const {token} = req.body;
    const result = await UserController.checkTokenResetPassword(token);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
});

router.post('/resetpassword', async (req, res, next) =>{
  try {
    const {token, password} = req.body;
    const result = await UserController.resetPassword(token, password);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({error: error});
  }
})

// testing token
//http://localhost:8686/test-token
// authentication: Chứng thực
// authorization: phân quyền
//1: user
//2: manager
router.get('/test-token',[checkToken, checkRole.checkRoleManager], async (req, res, next) =>{
  try {
    console.log('>>>>>>>>>', req.user)
    return res.status(200).json({message: 'test thành công'});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
})

router.put('/changedPassword/:id', async (req, res, next) =>{
  try {
    const {body} = req;
    const {id} = req.params;
    const user = await UserController.changedPassword(id, body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
})

/// game 
router.put('/updateLevel/:id', async (req, res, next) =>{
  try {
    const {body} = req;
    const {id} = req.params;
    await UserController.updateLevel(id, body);
    return res.status(200).json({message: 'cập nhập thành công'});
  } catch (error) {
    return res.status(500).json({message: 'cập nhập thất bại'});
  }
})

// gửi email

router.put('/updateUser/:id', async (req, res, next) =>{
  try {
    const {body} = req;
    const {id} = req.params;
    
    await UserController.updateProfile(id, body);
    return res.status(200).json({message: 'Cập nhập thành công'});
  } catch (error) {
    return res.status(500).json({message: 'Cập nhập thông tin thất bại'});
  }
});



  const nodemailer = require("nodemailer");
  const crypto = require('crypto');

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    const randomIndex = Math.floor(Math.random() * 100000);

    if (user) {
      // const resetToken = crypto.randomBytes(20).toString('hex');
      // const resetTokenExpiration = Date.now() + 3600000;
      
      // user.resetToken = resetToken;
      // user.resetTokenExpiration = resetTokenExpiration;
      // await user.save();

      // const resetLink = `http://localhost:8686/users/forgot-password?token=${resetToken}`;
      // console.log('Reset link:', resetLink);
      user.password = randomIndex;
      await user.save();

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bason1607200@gmail.com",
            pass: "dhdbsgfafflhokzw",
          },
        });

        // send mail with defined transport object
        await transporter.sendMail({
          from: "bason1607200@gmail.com",
          to: email,
          subject: "Hello ✔",
          html: `<a href="http://localhost:3000/changedPassword/${user._id}">Click vào đây</a>`,
        });

        // If the email is sent successfully, respond with a success message
        res.json({ message: `Gửi email thành công đến ${email}` });
      } catch (error) {
        // Log the error for debugging purposes
        console.error('Error sending email:', error);
        res.status(500).json({
          message: "Đã có lỗi xảy ra khi gửi email.",
          error: error.message,
        });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      message: "Lỗi",
      error: error.message,
    });
  }
});

router.post('/update-password', (req, res) => {
  const newPassword = req.body.newPassword;
  const retypePassword = req.body.retypePassword;

  // Kiểm tra xem mật khẩu mới và mật khẩu nhập lại có khớp không
  if (newPassword === retypePassword) {
      // Thực hiện các thao tác cập nhật mật khẩu ở đây
      console.log("Password updated successfully!");
      res.send("Password updated successfully!");
  } else {
      console.log("Passwords do not match!");
      res.send("Passwords do not match!");
  }
});

// router.post('/forgot-password/:token', async (req, res) => {
//   const {token} = req.params;
//   const {password } = req.body;

//   try {
//       // Tìm người dùng với token và kiểm tra hạn dùng của token
//       const user = await UserModel.findOne({
//           resetToken: token,
//           resetTokenExpiration: { $gt: Date.now() },
//       });

//       if (user) {
//           // Đặt lại mật khẩu và xóa thông tin đặt lại mật khẩu
//           user.password = password; // Thay thế bằng cách hash và salt mật khẩu mới
//           user.resetToken = null;
//           user.resetTokenExpiration = null;

//           await user.save();

//           return res.json({ message: 'Đặt lại mật khẩu thành công.' });
//       } else {
//           return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
//       }
//   } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Đã có lỗi xảy ra khi đặt lại mật khẩu.' });
//   }
// });

router.post('/forgotPasswordAPP', async (req, res, next) =>{
  try {
    const {email} = req.body;
    const user = await UserController.forgotPasswordAPP(email);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

router.post('/checkOTP', async (req, res, next) =>{
  try {
    const {token} = req.body;
    const user = await UserController.checkOTP(token);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
})

router.post('/resetpasswordAPP', async (req, res, next) =>{
  try {
    const {token, password} = req.body;
    console.log("otp",token,password)
    const result = await UserController.resetPasswordAPP(token, password);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({error: error});
  }
})





module.exports = router;
