/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Rectangle = require('./rectangle');
	var Control = require('./control');

	function RectControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var rectConf = {name:'Rectangle', type:'Rectangle', data:[]};
			var rect = new Rectangle(rectConf);
			self.getMask().addShape(rect);
			self.getMask().setSelectedShape(rect);
			console.log('rect init');
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
			console.log('rect deinit');
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

	RectControl.prototype = Object.create(Control.prototype);
	RectControl.prototype.constructor = RectControl;	

	module.exports = RectControl;
})();

