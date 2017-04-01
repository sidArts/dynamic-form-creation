var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon());
app.use(favicon(path.join(__dirname+'/favicon.ico')));
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'html')));


/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3001, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3001/');
*/
var templateSchema = mongoose.Schema({
    "title": String }, {strict: false});

var Template = mongoose.model('templateForms', templateSchema);
if(app.get('env') == 'development') {
 //app.use(express.errorHandler());
 mongoose.connect('mongodb://127.0.0.1:27017/template');
}

mongoose.model('users', { name: String  });

app.get('/users', function(req, res) {
 mongoose.model('users').find(function(err, users){
  res.send(users);
 });
});


app.get('/forms', function(req, res) {
 mongoose.model('templateForms').find(function(err, forms){
  res.send(forms);
 });
});

app.get('/createTemplate', function(req, res) {
	res.sendFile('createTemplate.html');
});

app.get('/myTemplates', function(req, res){
	
});



app.get('/', function(request, response){ 

 console.log('request for index.html');
 response.sendFile('index.html');

});



app.post('/', function(req, res) {
 //res.end(JSON.stringify(req.body));
 console.log(req.body);
 new Template(req.body).save(function(err, doc) {
 	if(err) console.log(err);
 	else res.send('successfully inserted');
 });
});



http.createServer(app).listen(app.get('port'), function(){

	console.log('listening on port'+ app.get('port'));

});



