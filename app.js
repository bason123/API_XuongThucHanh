// import "bootstrap/dist/css/bootstrap.min.css";
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/demoNews', 
  { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected successfully'))
  .catch(err => console.log(err));

  //chú ý thứ tự import
  require('./components/users/model');
  require('./components/news/model');
  require('./components/categories/model')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');
var categoriesRouter = require('./routes/categories')
const bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());//<<<<<<<<<<<<<<<<<<<<<<<<
app.use(bodyParser.json());

// http://localhost:8686/
app.use('/', indexRouter);

// http://localhost:8686/users
app.use('/users', usersRouter);

// http://localhost:8686/news
app.use('/news', newsRouter); 

// http://localhost:8686/categories
app.use('/categories', categoriesRouter); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// http://localhost:3000/phep-toan/
// http://localhost:3000/tinh-toan/10/20/cong




// req : request (yêu cầu)
        // + body: dữ liệu gửi lên
        // + params: dữ liệu trên url
        //  + query: dữ liệu trên url
// res : response (phản hồi)
        // + json: trả về dữ liệu dạng json
        // + send: trả về dữ liệu dạng text
        // + render: trả về dữ liệu dạng html
// next: chuyển tiếp sang middleware tiếp theo
