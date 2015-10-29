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
		var dragging = false;
		var selectedObject = null;

		/*
		* Initialization
		*/

		angular.forEach(shapeList, function(shape) {
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

		/*
		* Methods
		*/

		self.getJson = function getJson() {
			return json;
		};

		self.getDragging = function() {
			return dragging;
		};
		self.setDragging = function(val) {
			dragging = val ? true : false;
		};

		self.draw = function(context) {
			console.log(self);
			angular.forEach(shapes, function(shape) {
				shape.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			for(var i = 0; i < shapes.length; i++) {
				for(var j = 0; j < shapes[i].points.length; j++) {
					if(shapes[i].points[j].hit(mx, my)) {
						console.log('point was clicked');
						self.dragging = true;
						selectedObject = shapes[i].points[j];
						return true;
					}
				}
			}
			return false;
		};

		self.stopDrag = function() {
			self.dragging = false;
			selectedObject = null;
		};

		self.moveDrag = function(mx, my) {
			selectedObject.moveTo(mx, my);
		};

		return self;
	}

	module.exports = Mask;
})();
