(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		var self = this;

		self.json = path;
		self.name = path.name;
		self.type = path.type;
		self.points = [];

		angular.forEach(path.data, function(value, key) {
			self.points.push(new Point(value));
		});

		self.draw = function(context) {
			console.log(self);
			for(var i = 0; i < self.points.length - 1; i++) {
				context.beginPath();
				context.moveTo(self.points[i][0], self.points[i][1]);
				context.moveTo(self.points[i+1][0], self.points[i+1][1]);
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
