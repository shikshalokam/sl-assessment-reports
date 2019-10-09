var createError = require('http-errors');
var express = require('express');
var path = require('path');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger/swagger.json');
var app = express();
const fileUpload = require('express-fileupload');
var db = require('./src/mongo/db');
var routes = require('./src/school/routes/school');
var config = require('./src/config/config');
var logger = require('./src/utils/logger');

app.use(fileUpload());
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// var options = {
//   swaggerOptions: {
//     authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
//   }
// };

app.use('/api/v1/schools/dcpcrapi-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes);

app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json('error')
});

app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// Connect to Mongo on start

db.connect('mongodb://' + config.mongohostname + ':' + config.mongoport, function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    console.log(err);
    // logger.loggererrorschool.error('Unable to connect to Mongo.');
    // logger.loggererrorschool.error(err);
  } else {
    app.listen(config.appPortNo, function () {
      console.log('Listening on port ' + config.appPortNo + '...');
      console.log('Mongo connected');
      // logger.loggerinfoschool.info('Listening on port ' + config.appPortNo + '...');
      // logger.loggerinfoschool.info('Mongo connected')
    })
  }
})

module.exports = app;


