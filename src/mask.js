/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Polygon = require('./polygon');
	/*
	var Line = require('./line');
	var Rectangle = require('./rectangle');
	*/

	function Mask(shapeList) {
		var self = this;

		var json = shapeList;
		var shapes = [];
		var selectedShape = null;
		var selectedPoint = null;
		var addingMode = false;

		/*
		* Methods
		*/

		self.getJson = function getJson() {
			return json;
		};

		self.setConfig = function setConfig(config) {
			shapes = [];
			angular.forEach(config, function initializeShapes(shape) {
				switch(shape.type) {
					case 'Polygon':
						shapes.push(new Polygon(shape));
						break;
					/*
					case 'Line':
						shapes.push(new Line(shape));
						break;
					case 'Rectangle':
						shapes.push(new Rectangle(shape));
						break;
					*/
					default:
						console.warn('Unknown shape: ' + shape.type);
						break;
				}
			});

		};

		self.draw = function(context) {
			angular.forEach(shapes, function drawShapes(shape) {
				shape.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			for(var i = 0; i < shapes.length; i++) {
				var points = shapes[i].getPoints();
				for(var j = 0; j < points.length; j++) {
					if(points[j].hit(mx, my)) {
						selectedPoint = points[j];
						return true;
					}
				}
				points = null;
			}
			return false;
		};

		self.stopDrag = function() {
			selectedShape = null;
		};

		self.drag = function(mx, my) {
			selectedPoint.moveTo(mx, my);
		};

		self.startAddMode = function() {
			addingMode = true;
		};
		self.endAddMode = function() {
			addingMode = false;
			selectedShape = null;
		};

		self.addShape = function(shape) {
			shapes.push(shape);
		};

		self.getSelectedShape = function() {
			return selectedShape;
		};

		self.setSelectedShape = function(shape) {
			selectedShape = shape;
		};

		self.getSelectedPoint = function() {
			return selectedPoint;
		};

		self.setSelectedPoint = function(point) {
			selectedPoint = point;
		};

		self.addPoint = function(mx, my) {
			selectedPoint = selectedShape.addPoint(mx, my);
			return true;
		};

		/*
		* Initialization
		*/

		self.setConfig(shapeList);

		return self;
	}

	module.exports = Mask;
})();
