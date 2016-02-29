/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Shape = require('./shape');

	function Line(conf) {
		var self = this;

		/*
		* Initialization
		*/

		var strokeColor = '#ffffff';
		Shape.call(self, conf);

		self.setMaxPoints(2);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			context.strokeStyle = strokeColor;

			var points = self.getPoints();
			if(angular.isArray(points)) {
				if(points.length === 2) {
					context.beginPath();
					context.moveTo(points[0].x, points[0].y);
					context.lineTo(points[1].x, points[1].y);
					context.stroke();
				}
				angular.forEach(points, function drawPoint(point) {
					point.draw(context);
				});
			}


			context.strokeStyle = savedColor;
		};

		return self;
	}

	Line.prototype = Object.create(Shape.prototype);
	Line.prototype.constructor = Line;

	module.exports = Line;
})();
