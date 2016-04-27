'use strict';

var express = require('express');
var router = express.Router();
var ForecastIo = require('forecastio');
var forecastIo = new ForecastIo('55ba705ae17d6bc8c78fa6313626f84f');

module.exports = function () {

	router.post('/', function (req, res) {
		console.log(req.body);
		forecastIo.forecast(req.body.lat, req.body.lon).then(function(data) {
			console.log(data);
  		return res.status(200).send(data);
		});

	});

	return router;

};
