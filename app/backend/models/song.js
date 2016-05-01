'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
	title: {type: String, required: true},
	artist: {type: String, required: true},
	album: {type: String, required: true},
	tracklength: {type: String},
	trackNumber: {type: Number},
	//owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	file: {type: String, required: true},
	playlist: [{type: String}],
	//allowedAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


songSchema.statics = {
	fillDoc: function (document, bodyReq, callback) {
		for (var field in this.schema.paths) {
			if(field !== '_id' && field !== '_v' && bodyReq[field] !== undefined) {
				document[field] = bodyReq[field];
			}
		}
		document.save(callback);
	}
};

mongoose.model('Song', songSchema, 'songs');
