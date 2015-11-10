/* jshint node:true */
(function() {
	'use strict';

	var Control = require('./control');

	function EditControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		console.log('new edit control');
		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		// Called when dragging starts
		self.startDrag = function(x, y) {
			console.log('in editcontrol.startDrag');
			if(self.getMask().startDrag(x, y)) {
				console.log('start drag');
				self.setDragging(true);
				return true;
			}
			return false;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			console.log('in editcontrol.stopDrag');
			self.getMask().stopDrag(x, y);
			self.setDragging(false);
		};

		// Called while dragging
		self.drag = function(x, y) {
			console.log('in editcontrol.drag');
			self.getMask().drag(x, y);
		};

		return self;
	}

	module.exports = EditControl;
})();

