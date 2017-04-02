var http    	= require('http');
var express 	= require('express');
var path       	= require('path');
var favicon  	= require('serve-favicon');
var mongoose 	= require('mongoose');
var bodyParser 	= require('body-parser');
var jwt    		= require('jsonwebtoken');
var fs 			= require('fs');


var config = require('./config'); // get our config file
// get our mongoose model
var User   = require('./models/user'); 
var JSONWebToken = require('./models/JSONWebToken');

var app = express();

app.use(bodyParser());
app.set('port', process.env.PORT || 3000);


app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'html'))
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'html')));


app.use(favicon(path.join(__dirname+'/favicon.ico')));

app.set('superSecret', config.secret); // secret variable

var templateSchema = mongoose.Schema({ "title": String }, {strict: false});

var Template = mongoose.model('templateForms', templateSchema);

if(app.get('env') == 'development') {
	//app.use(express.errorHandler());
	mongoose.connect('mongodb://127.0.0.1:27017/template');
}


app.get('/setup', function(req, res) {

  // create a sample user
  var user = new User({ 
    name: 'sid', 
    password: '123',
    admin: true 
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

var apiRoutes = express.Router(); 


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

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
          expiresIn: expiry // expires in 24 hours
        });

        var tokenModel = new JSONWebToken({
        	token: token, 
    		  lastAccessed: new Date().getTime()
        });

        tokenModel.save(function(err) {
        	
        	if (err) throw err;

      		console.log('Token generated & saved to DB ::: '+token);
          res.header('x-access-token', token);

          res.render('homepage', { token:token });
      	});

        // return the information including token as JSON

      }   

    }

  });
});



// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

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
  		

      console.log('Token Object %%%',tokenObject);
  		var now = new Date().getTime();
  		console.log('now ++++ > '+ now + ' type of now is :::: '+ typeof now);
  		console.log('Last accessed ::: '+ tokenObject.lastAccessed);

  		console.log('Differeence === '+ (now - tokenObject.lastAccessed));


  		if((now - tokenObject.lastAccessed) < 3600000) {
  			jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		      } else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded; 
            console.log('Decoded string ::: ', decoded)
		        var query = { token: token };
	            var newData = query;
	            newData.lastAccessed = new Date().getTime();
	            JSONWebToken.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
              		if (err) return res.send(500, { error: err });
              		console.log('Token updated');
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
});


apiRoutes.get('/forms', function(req, res) {
  var token = req.headers['x-access-token'];
  JSONWebToken.findOne({
    token: token
  }, function(err, tokenObject) {
      if(err) throw err;

      jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.status(403).send('Invalid Token');    
          } else {
              var data = {};
              data.createdBy = decoded._doc._id;
              console.log(data);
              mongoose.model('templateForms').find(data, function(err, forms){
                res.send(forms);
              });
          }
      });    
  });  
  
});

apiRoutes.get('/form/:id', function(req, res) {
  var formId = req.params.id;
  var token = req.headers['x-access-token'];
  JSONWebToken.findOne({
    token: token
  }, function(err, tokenObject) {
      if(err) throw err;

      jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.status(403).send('Invalid Token');    
          } else {
              var data = {};
              data.createdBy = decoded._doc._id;
              data._id = mongoose.Types.ObjectId(formId);
              console.log(data);
              mongoose.model('templateForms').findOne(data, function(err, forms){
                res.send(forms);
              });
          }
      });    
  });  
  
});


apiRoutes.post('/createTemplate', function(req, res) {
  console.log('Form ID :::: ', req.body.formId);
  var id = (req.body.formId != undefined && req.body.formId != null) ? req.body.formId : '';
	res.render('createTemplate', {token: req.body.token, formId: id });
});

apiRoutes.post('/myTemplates', function(req, res){
	res.render('templateListing', {token: req.body.token});
});

apiRoutes.post('/saveTemplate', function(req, res) {
  var token = req.headers['x-access-token'];
  JSONWebToken.findOne({
    token: token
  }, function(err, tokenObject) {
      if(err) throw err;

      jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.status(403).send('Invalid Token');    
          } else {
              var data = req.body;
              data.createdBy = decoded._doc._id;
              if(data._id != undefined) {
                Template.findOneAndUpdate({
                  _id: mongoose.Types.ObjectId(data._id)
                }, data, {upsert:false}, function(err, doc){
                    
                    if (err) return res.send(500, { error: err });
                    
                    else res.send('successfully inserted');
                });
              } else {
                  new Template(data).save(function(err, doc) {
                    if(err) console.log(err);
                    else res.send('successfully inserted');
                   });
              }    
          }
      });
  });   
});

apiRoutes.delete('/deleteTemplate/:formId', function(req, res){
  var token = req.headers['x-access-token'];
  JSONWebToken.findOne({
    token: token
  }, function(err, tokenObject) {
      if(err) throw err;

      jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            res.status(403).send('Invalid Token');    
          } else {
            var data = mongoose.Types.ObjectId(req.params.formId);
            data.createdBy = decoded._doc._id;
            Template.findOne(data, function(err, doc){
              if(err)
                res.status(500).send(err);
              else 
                doc.remove(function(err){
                  if(err)
                    res.send(500, err);
                  else
                    res.send(204);
                });
            });
          }
      });
    });
});

app.get('/', function(request, response){ 

 response.render('login');

});





app.use('/api', apiRoutes);

http.createServer(app).listen(app.get('port'), function(){

	console.log('listening on port'+ app.get('port'));

});



