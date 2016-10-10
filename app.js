
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var dialog = require('dialog');
// all environments
app.set('port', process.env.VCAP_APP_PORT || 4020);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.session({
	  secret: 'kranthisecret',
	  saveUninitialized: true,
	  resave: true
	}));
app.use(app.router);
app.use(expressValidator({
	  errorFormatter: function(param, msg, value) {
	    var namespace = param.split('.')
	        , root    = namespace.shift()
	        , formParam = root;

	    while(namespace.length) {
	      formParam += '[' + namespace.shift() + ']';
	    }
	    return {
	      param : formParam,
	      msg   : msg,
	      value : value
	    };
	  }
	}));

	app.use(flash());
	app.use(function (req, res, next) {
	  res.locals.success_msg = req.flash('success_msg');
	  res.locals.error_msg = req.flash('error_msg');
	  res.locals.error = req.flash('error');
	  res.locals.user = req.user || null;
	  next();
	});

app.use(express.methodOverride());
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var mongo = process.env.VCAP_SERVICES;
assert = require('assert');
app.get('/', function (req, res) {
	  res.render('index', {});
	});
app.use(function(req,res,next){
   
    next();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

require('./config/passport')(passport);
require('./routes/index')(app, mongo,mongodb,passport,expressValidator,session);

