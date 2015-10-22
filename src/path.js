/* globals require, angular, module */
(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		var self = this;

		var json = null;
		var name = path.name;
		var type = path.type;
		self.points = [];

		/*
		 * Initialization
		 */

		json = path;

		angular.forEach(path.data, function(value) {
			self.points.push(new Point(value));
		});

		/*
		 * Methods
		 */

		self.name = function() { return name; };
		self.type = function() { return type; };

		self.draw = function(context) {
			console.log(self);
			for(var i = 0; i < self.points.length - 1; i++) {
				console.log(self.points[i].x, self.points[i].y);
				context.beginPath();
				context.moveTo(self.points[i].x, self.points[i].y);
				context.lineTo(self.points[i+1].x, self.points[i+1].y);
				context.stroke();
			}
			angular.forEach(self.points, function(point) {
				point.draw(context);
			});
		};

		return self;
	}

	module.exports = Path;
})();
