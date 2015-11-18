/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Line = require('./line');
	var Control = require('./control');

	function LineControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var lineConf = {name:'Line', type:'Line', data:[]};
			var line = new Line(lineConf);
			self.getMask().addShape(line);
			self.getMask().setSelectedShape(line);
			console.log('line init');
		};

		self.deinit = function() {
			var shape = self.getMask().getSelectedShape();
			var points = shape.getPoints();

			if(points.length < 2) {
				self.getMask().removeShape(shape);
			}

			// TODO: We should actually not even allow the creation of these points
			if(points.length > 2) {
				for(var i = 2; i < points.length; i++) {
					shape.removePoint(points[i]);
				}
			}

			self.getMask().setSelectedShape(null);
			console.log('line deinit');
		};

		// Called when dragging starts
		self.startDrag = function(x, y) {
			var point = new Point(x, y);
			self.getMask().addPoint(point);
			self.getMask().setSelectedPoint(point);
			self.getMask().startDrag();
			self.setDragging(true);
			return true;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.setDragging(false);
			self.getMask().stopDrag(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	LineControl.prototype = Object.create(Control.prototype);
	LineControl.prototype.constructor = LineControl;	

	module.exports = LineControl;
})();

