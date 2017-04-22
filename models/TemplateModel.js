var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({ 
							"title": String ,
							"viewMode": String,
							"backgroundColor": String,
							"createdBy": Schema.ObjectId,
							"createdAt": Date,
						    "updatedAt": { type: Date, default: Date.now },
						}, {strict: false});

var Template = mongoose.model('template', templateSchema);

module.exports = Template;
