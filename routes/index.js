
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Expressto' });
}; */ 
var express = require('express');
var dialog = require('dialog');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator=require('express-validator');

var user;
var User = require('../routes/user');
module.exports = function(app, mongo,mongodb,passport,expressValidator,session){
	 
	 console.log("test");
	 console.log(session);
    app.get('/signin', function(req, res) {
        console.log("test");
        });
   
app.post('/registerform', function(req, res) {
   var json={};
var firstname=req.body.firstname;
var lastname=req.body.lastname;
var email= req.body.email;
var password=req.body.password;
json.firstname=req.body.firstname;
json.lastname=req.body.lastname;
json.email= req.body.email;
json.password=req.body.password;
var url = 'mongodb://localhost:27017/registeruserdetails';
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);
	    console.log('test');
	   

	    // do some work here with the database.
	  var cursor = db.collection("userdetails").findOne( { "email": email  },function(err, result) {
		    assert.equal(err, null);
		    console.log("found records");
		    console.log(result);
		   if(result!=null)
			   {
			   console.log("user already exists");
			   user=req.session;
			   user.status="yes";
			   console.log(user);
			   res.render('index.ejs', {
 	  	          user : req.session // get the user out of session and pass to template
 	  	      });
			   dialog.warn("User already exists");
			   }
		   else
			   {
				  user=req.session;
				  user.name = {};
		    	  user.name.givenName=firstname;
		    	  user.name.familyName = lastname;
		    	  console.log(user);
		    	  	    //Close connection
		    	  	    insertDocument(db,json, function() {
		    	  	      db.close();
		    	  	      res.render('homepage.ejs', {
		    	  	          user : req.session // get the user out of session and pass to template
		    	  	      });
		    	  	    });
			   }
		  });
	      }

	    
	
	  
	});

});	

var insertDocument = function(db,json, callback) {
	console.log(json.firstname);
	   db.collection('userdetails').insertOne( {
	
	      "firstname" : json.firstname,
	      "lastname" : json.lastname,
	      "email" : json.email,
	      "password" :json.password 
	   }, function(err, result) {
	    assert.equal(err, null);
	    console.log("Inserted a document into the userdetails collection.");
	    callback();
	  });
	};

    app.get('/registerform', isLoggedIn, function(req, res) {
        res.render('homepage.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));


    app.get('/login/facebook/callback',
        passport.authenticate('facebook'),  function(req, res){

    	successRedirect : '/registerform'
    	 res.render('homepage.ejs', {
              user : req.user 
          });
            }
        );

    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/registerform',
            failureRedirect : '/'
        }));
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
 
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.post('/signinform',function (req,res){
    	var email=req.body.email;
    	var password=req.body.password;
    	var url = 'mongodb://localhost:27017/registeruserdetails';
    	var MongoClient = require('mongodb').MongoClient
    	, format = require('util').format;
    	MongoClient.connect(url, function (err, db) {
    		  if (err) {
    		    console.log('Unable to connect to the mongoDB server. Error:', err);
    		  } else {
    		   
    		    console.log('Connection established to', url);
    		    console.log('test');
    		    var cursor = db.collection("userdetails").findOne( { "email": email  },function(err, result) {
    			    assert.equal(err, null);
    			   if(result!=null && result.password == password)
    				   {
    				   user=req.session;
    				   user.name = {};
 			    	   user.name.givenName=result.firstname;
 			    	   user.name.familyName=result.lastname;
    				   res.render('homepage.ejs', {
		    	  	          user : req.session 
		    	  	      });
    				   }
    			   else
    				   { 
    			    	 res.render('index.ejs');
    			    	 dialog.warn("Invalid username/password");
    				   }
    			  });
    }
    });
    });


};







function isLoggedIn(req, res, next) {


    if (req.isAuthenticated())
        return next();


    res.redirect('/');
}
