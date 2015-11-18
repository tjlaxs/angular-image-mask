/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Polygon = require('./polygon');
	var Control = require('./control');

	function PolyControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var polyConf = {name:'Polygon', type:'Polygon', data:[]};
			var poly = new Polygon(polyConf);
			self.getMask().addShape(poly);
			self.getMask().setSelectedShape(poly);
			console.log('poly init');
		};

		self.deinit = function() {
			self.getMask().setSelectedShape(null);
			console.log('poly deinit');
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

	PolyControl.prototype = Object.create(Control.prototype);
	PolyControl.prototype.constructor = PolyControl;	

	module.exports = PolyControl;
})();

