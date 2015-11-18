/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Point = require('./point');

	function Shape(conf) {
		var self = this;

		// Default to supplied shape or empty polygon
		var json = conf || {name: 'Shape', type: 'Polygon', data: []};
		var name = json.name;
		var type = json.type;
		var points = [];

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
			var point;
			if(angular.isArray(x)) {
			console.log('array:' + x + ' ' + y);
				point = new Point(x);
			} else if(angular.isObject(x)) {
				point = x;
			} else {
			console.log('points:' + x + ' ' + y);
				point = new Point(x, y);
			}

			json.data.push(point.getJson());
			points.push(point);
		};

		self.draw = function shapeDraw(context) {
			angular.forEach(points, function shapeDrawPoint(point) {
				point.draw(context);
			});
		};
	
		/*
		* Initialization
		*/

		angular.forEach(json.data, function initializePoints(value) {
			points.push(new Point(value));
		});
	
		return self;
	}

	module.exports = Shape;
})();
