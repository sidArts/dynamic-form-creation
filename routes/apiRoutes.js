var mongoose    = require('mongoose');
var express      = require('express');
var app          = express();

var apiRoutes    = express.Router();

var Template     = require("../models/TemplateModel");

var jwtMiddleware = require("./jwtMiddleware");

// route middleware to verify a token
apiRoutes.use(jwtMiddleware);

apiRoutes.get('/forms', function(req, res) {
  
  var data = {};
  data.createdBy = req.user._id;
  console.log("Query params ::: ", data);
  Template.find(data, function(err, forms){
    res.send(forms);
  });       
  
});

apiRoutes.get('/form/:id', function(req, res) {
  
  var data = {};
  data.createdBy = req.user._id;
  data._id = mongoose.Types.ObjectId(req.params.id);
  console.log(data);
  Template.findOne(data, function(err, forms){
    res.send(forms);
  });

}); 




apiRoutes.post('/saveTemplate', function(req, res) {
  
  var data = req.body;
  data.createdBy = req.user._id;
  if(data._id != undefined) {
    Template.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(data._id)
    }, data, { upsert:false }, function(err, doc){
        
        if (err) return res.send(500, { error: err });
        
        else res.send('successfully inserted');
    });
  } else {
      data.createdAt = new Date();
      new Template(data).save(function(err, doc) {
        if(err) console.log(err);
        else res.send('successfully inserted');
      });
  }    
         
});

apiRoutes.delete('/deleteTemplate/:formId', function(req, res){
      var data = mongoose.Types.ObjectId(req.params.formId);
      data.createdBy = req.user._id;
      Template.findOne(data, function(err, doc){
        if(err)
          res.status(500).send(err);
        else 
          doc.remove(function(err){
            if(err)
              res.send(500, err);
            else
              res.sendStatus(204);
          });
      });
});

module.exports = apiRoutes;


