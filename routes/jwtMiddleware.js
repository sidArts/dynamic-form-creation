var express      = require('express');
var jwt          = require('jsonwebtoken');
var JSONWebToken = require('../models/JSONWebToken');
var app          = express();

var config       = require('../config'); // get our config file

app.set('superSecret', config.secret); // secret variable

module.exports = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

  	JSONWebToken.findOne({
    	token: token
  	}, function(err, tokenObject) {
  		
      if(err) throw err;

      if(tokenObject == null)
        res.end('Token is empty!');  		

      // console.log('Token Object %%%',tokenObject);
  		var now = new Date().getTime();

  		if((now - tokenObject.lastAccessed) < 3600000) {
  			jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		      } else {
		        // if everything is good, save to request for use in other routes
		          req.user = decoded._doc;             
		          var query = { token: token };
	            var newData = query;
	            newData.lastAccessed = new Date().getTime();
	            JSONWebToken.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
                if (err) res.send(500, { error: err });
                next();
	            });   
		      }
		    });
  		} else {
  			res.end('Your session expired!');
  		}
 	  });

    // verifies secret and checks exp
    

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};