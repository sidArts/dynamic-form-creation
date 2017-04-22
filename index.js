var http    	  = require('http');
var express 	  = require('express');
var path       	= require('path');
var favicon  	  = require('serve-favicon');
var ejs         = require('ejs');
var mongoose 	  = require('mongoose');
var bodyParser 	= require('body-parser');
var jwt    		  = require('jsonwebtoken');
var fs 			    = require('fs');

var app = express();

var config = require('./config'); // get our config file

// get our mongoose model
var User         = require('./models/User'); 
var JSONWebToken = require('./models/JSONWebToken');
var Template     = require("./models/TemplateModel");


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);


app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'html'))
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, 'html')));


app.use(favicon(path.join(__dirname+'/favicon.ico')));

app.set('superSecret', config.secret); // secret variable

if(app.get('env') == 'development') {
	//app.use(express.errorHandler());
	mongoose.connect('mongodb://127.0.0.1:27017/template');
}


var rootContextRouter = require("./routes/rootContextRoutes");

app.use("/", rootContextRouter);

var apiRoutes = require("./routes/apiRoutes");

app.use('/api', apiRoutes);

// app.use("/api/template", templateRoutes);

http.createServer(app).listen(app.get('port'), function(){

	console.log('listening on port : '+ app.get('port'));

});



