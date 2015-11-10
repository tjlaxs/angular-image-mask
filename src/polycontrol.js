/* jshint node:true */
(function() {
	'use strict';

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
		};

		self.deinit = function() {
			self.getMask().setSelectedShape(null);
		};

		// Called when dragging starts
		self.startDrag = function(x, y) {
			self.getMask().addPoint(x, y);
			self.setDragging(true);
			return true;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.getMask().stopDrag(x, y);
			self.setDragging(false);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	module.exports = PolyControl;
})();

