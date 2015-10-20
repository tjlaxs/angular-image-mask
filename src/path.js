(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		this.json = path;
		this.name = path.name;
		this.type = path.type;
		this.points = [];
		angular.forEach(path.data, function(value, key) {
			this.points.push(new Point(value));
		});
		return this;
	}

	Path.prototype.draw = function(context) {
		console.log(this);
		for(var i = 0; i < this.points.length - 1; i++) {
			context.beginPath();
			context.moveTo(this.points[i][0], this.points[i][1]);
			context.moveTo(this.points[i+1][0], this.points[i+1][1]);
			context.stroke();
		}
		angular.forEach(this.points, function(point) {
			point.draw(context);
		});
	};

	module.exports = Path;
})();
