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

		// Default to supplied shape or empty polygon
		var json = conf || {name: 'Shape', type: 'Polygon', data: []};
		var name = conf.name;
		var type = conf.type;
		var points = [];

		angular.forEach(conf.data, function initializePoints(value) {
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
		self.addPoint = function(x, y) {
			var point = new Point(x, y);
			json.data.push(point.getJson());
			points.push(point);
		};

		self.draw = function shapeDraw(context) {
			angular.forEach(points, function shapeDrawPoint(point) {
				point.draw(context);
			});
		};
	
		return self;
	}

	module.exports = Shape;
})();
