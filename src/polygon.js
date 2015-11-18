/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Shape = require('./shape');

	function Polygon(conf) {
		/*
		* Initialization
		*/

		var self = this;
		var strokeColor = '#ffffff';
		var fillColor = 'rgba(0, 0, 0, 0.3)';
		Shape.call(self, conf);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			var savedFillColor = context.fillStyle;
			context.strokeStyle = strokeColor;
			context.fillStyle = fillColor;

			var points = self.getPoints();
			if(angular.isArray(points) && points.length > 0) {
				context.beginPath();
				context.moveTo(points[0].x, points[0].y);
				for(var i = 1; i < points.length; i++) {
					context.lineTo(points[i].x, points[i].y);
				}
				context.closePath();
				context.stroke();
				context.fill();
				angular.forEach(points, function drawPoint(point) {
					point.draw(context);
				});
			}

			context.strokeStyle = savedColor;
			context.fillStyle = savedFillColor;
		};

		return self;
	}

	Polygon.prototype = Object.create(Shape.prototype);
	Polygon.prototype.constructor = Polygon;

	module.exports = Polygon;
})();
