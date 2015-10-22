/* globals require, angular, module */
(function() {
	'use strict';

	var Path = require('./path.js');

	function Mask(pathList) {
		var self = this;

		var json = pathList;
		var paths = [];
		self.dragging = false;
		var selectedObject = null;

		/*
		 * Initialization
		 */

		angular.forEach(json, function(value) {
			paths.push(new Path(value));
		});

		/*
		 * Methods
		 */

		self.draw = function(context) {
			console.log(self);
			angular.forEach(paths, function(path) {
				path.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			for(var i = 0; i < paths.length; i++) {
				for(var j = 0; j < paths[i].points.length; j++) {
					if(paths[i].points[j].hit(mx, my)) {
						console.log('point was clicked');
						self.dragging = true;
						selectedObject = paths[i].points[j];
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
