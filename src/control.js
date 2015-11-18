/* jshint node:true */
(function() {
	'use strict';

	function Control(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		var _scope = scope;
		var _mask = mask;
		var _dragging = false;
		var _mouseX = null;
		var _mouseY = null;
	
		/*
		* Public methods
		*/

		self.getMask = function() {
			return _mask;
		};
		self.getScope = function() {
			return _scope;
		};
		self.getDragging = function() {
			return _dragging;
		};
		self.setDragging = function(val) {
			_dragging = !!val;
		};

		self.init = function() {console.log('init');};
		self.deinit = function() {console.log('deinit');};

		self.updateMouse = function(x, y) {
			_mouseX = x;
			_mouseY = y;
		};
	
		// Called when dragging starts
		self.startDrag = function(x, y) {
			self.updateMouse(x, y);
			return false;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.updateMouse(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.updateMouse(x, y);
		};

		return self;
	}

	module.exports = Control;
})();
