var createError = require('http-errors');
var express = require('express');
var path = require('path')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var db = require('./database');

var app = express();

//view engine setup
app.set('views',path.join( __dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(
   express.static(
      path.join(
         __dirname, 'public'
      )
   )
);

app.use(session({
   secret: '123456catr',
   resave: false,
   saveUninitialized: true,
   cookie: {maxAge: 60000}
}))

app.use(flash());
app.get('/', function(req, res, next) {
   res.render('signup', {
       title: 'SignUp'
   });
});

app.post('/',function(req, res, next) {
   var f_name = req.body.registerfname;
   var l_name = req.body.registerlname;
   var phoneNum = req.body.phnum;
   var userId = req.body.userid;
   var password = req.body.userpass;
   const hashedPassword = await bcrypt.hash(password,10);

   var sql = `INSERT INTO users (
      first_name, last_name, user_id, password, phone_no
      ) VALUES (
         "${f_name}",
         "${l_name}",
         "${userId}",
         "${hashedPassword}"
         "${phoneNum}",
         )`;
   db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      req.flash('success','User Added Successfully!');
      res.redirect('/');
   });
});
app.use(function(req, res, next) {
   next(createError(404));
});
app.use(function (err, req, res, next) {
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   res.status(err.status || 500);
   res.render('error');
});

app.listen(3000, function() {
   console.log('Node app is running on port 3000');
});

module.exports = app;