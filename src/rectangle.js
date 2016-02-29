/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Shape = require('./shape');

	function Rectangle(conf) {
		/*
		* Initialization
		*/

		var self = this;
		var strokeColor = '#ffffff';
		var fillColor = 'rgba(0, 0, 0, 0.3)';
		Shape.call(self, conf);

		self.setMaxPoints(2);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			var savedFillColor = context.fillStyle;
			context.strokeStyle = strokeColor;
			context.fillStyle = fillColor;

			var points = self.getPoints();
			if(angular.isArray(points)) {
				if(points.length === 2) {
					var x = points[0].x;
					var y = points[0].y;
					var w = points[1].x - x;
					var h = points[1].y - y;

					context.fillRect(x, y, w, h);
					context.strokeRect(x, y, w, h);
				}
				angular.forEach(points, function drawPoint(point) {
					point.draw(context);
				});
			}

			context.strokeStyle = savedColor;
			context.fillStyle = savedFillColor;
		};

		return self;
	}

	Rectangle.prototype = Object.create(Shape.prototype);
	Rectangle.prototype.constructor = Rectangle;

	module.exports = Rectangle;
})();
