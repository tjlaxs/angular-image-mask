/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Point = require('./point');

	function Shape(conf) {
		var self = this;

		/*
		* Initialization
		*/
		
		var json = conf;
		var name = conf.name;
		var type = conf.type;
		var points = [];

		angular.forEach(conf.data, function(value) {
			points.push(new Point(value));
		});
	
		/*
		* Public methods
		*/
	
		self.setName = function(newName) {
			name = newName;
		};
		self.getName = function() {
			return name;
		};
	
		self.getType = function() {
			return type;
		};
	
		self.getJson = function() {
			return json;
		};

		self.getPoints = function() {
			return points;
		};

		self.draw = function drawPoints(context) {
			angular.forEach(points, function drawPoints(point) {
				point.draw(context);
			});
		};
	
		return self;
	}

	module.exports = Shape;
})();
