/* jshint node:true */
(function() {
	'use strict';

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

		// Called when dragging starts
		self.startDrag = function(x, y) {
			if(self.getMask().startDrag(x, y)) {
				self.setDragging(true);
				return true;
			}
			return false;
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

