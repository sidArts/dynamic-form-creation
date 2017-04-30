var express      = require('express');
var jwt          = require('jsonwebtoken');

var app          = express();
var rootContext  = express.Router();

var User         = require('../models/User'); 
var JSONWebToken = require('../models/JSONWebToken');

var config       = require('../config'); // get our config file

app.set('superSecret', config.secret); // secret variable

rootContext.get('/', function(request, response){ 

 response.render('login');

});

rootContext.post('/createTemplate', function(req, res) {
  console.log('Form ID :::: ', req.body.formId);
  var id = (req.body.formId != undefined && req.body.formId != null) ? req.body.formId : '';
  res.render('createTemplate', {token: req.body.token, formId: id, activeTab: 'createTemplate' });
});

rootContext.post('/myTemplates', function(req, res){
  res.render('templateListing', {token: req.body.token, activeTab: 'myTemplates'});
});

rootContext.get('/setup', function(req, res) {

  // create a sample user
  var user = new User({ 
    name: 'admin', 
    password: 'admin',
    admin: true 
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
rootContext.post('/auth', function(req, res) {

  console.log(req.body);
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var expiry = 3600;
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: expiry // expires in 1 hour
        });

        var tokenModel = new JSONWebToken({
          token: token, 
          lastAccessed: new Date().getTime()
        });

        tokenModel.save(function(err) {
          
          if (err) throw err;

          console.log('Token generated & saved to DB ::: '+token);
          res.header('x-access-token', token);

          res.render('templateListing', { token:token });
        });

        // return the information including token as JSON

      }   

    }

  });
});

module.exports = rootContext;