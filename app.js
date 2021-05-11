var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var exphbs  = require('express-handlebars');


require("express-async-errors");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var db = require("./db");

// ------------------------------------SENTIMINT------------------------------------------------------- 
//To use the router module in your main app file we must define the routes with require()
// example ---> var wiki = require('./wiki.js'); 
//var indexRouter = require('./routes/index');  // <== Defines "index.js" route for example in our project
//var usersRouter = require('./routes/users');   
//Insert "routes" Files below here: ---> ie "your_controller.js"
var registrationRouter = require("./routes/registration");         //Registration
var journalRouter = require("./routes/journal");
var mentalHealthResourceRouter = require("./routes/mental_health_resource");
var therapistRouter = require("./routes/therapist");
var therapistRegistrationRouter= require("./routes/therapist_registration");
var appointmentRouter = require("./routes/appointment");
var paymentRouter = require("./routes/payment");
var therapist_registrationRouter = require("./routes/therapist_registration");
var HR_viewRouter = require("./routes/HR_view");
var group_registrationRouter = require("./routes/group_registration");




// ------------------------------------SENTIMINT------------------------------------------------------- 
//const { Db } = require('mongodb');

var app = express();

//view engine setup

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: false}));
app.set('view engine', '.hbs');     


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'my secret string',
  store: new MongoStore({ url: db.url }),
}));


// ------------------------------------SENTIMINT------------------------------------------------------- 
// SENTIMINT 
// We then call use() on the Express application to add the Router to the middleware handling path,
// by specifying a URL path ie ---> app.use('/wiki',wiki); 

//app.use('/', indexRouter);            // at the moment this declares the root directory 
//app.use('/users', usersRouter);
//add handling path: ---> ie "your_controller_name"
app.use('/', registrationRouter ); //       "/" signifies home
app.use('/', journalRouter);
app.use('/', mentalHealthResourceRouter);
app.use('/', therapistRouter);
app.use('/', appointmentRouter);
app.use('/', paymentRouter);
app.use('/', therapist_registrationRouter);
app.use('/', HR_viewRouter);
app.use('/', group_registrationRouter);










// ------------------------------------SENTIMINT------------------------------------------------------- 

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
