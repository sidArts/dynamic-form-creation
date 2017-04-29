var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectionSchema = new Schema({
	viewMode: String,
	backgroundColor: String,
	formElements: []
});

var templateSchema = new Schema({ 
							"title": {
								"text": String,
								"align": String,
								"size": { "type": String, "default": "1" }
							} ,
							"sections": [{
								"heading": {
									"text": String,
									"align": String,
									"size": { "type": String, "default": "2" }
								},
								"name": String,
								"viewMode": String,
								"backgroundColor": String,
								"formElements": { "type" : Array , "default" : [] }
							}],
							"createdBy": Schema.ObjectId,
							"createdAt": Date,
						    "updatedAt": { type: Date, default: Date.now },
						}, {strict: false});

var Template = mongoose.model('template', templateSchema);

module.exports = Template;
