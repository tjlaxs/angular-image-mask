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
		Shape.call(self, conf);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var points = self.getPoints();
			context.beginPath();
			context.moveTo(points[0].x, points[0].y);
			for(var i = 1; i < points.length; i++) {
				context.lineTo(points[i].x, points[i].y);
			}
			context.closePath();
			context.stroke();
			context.fillStyle = 'hsla(120,100%,75%, 0.3';
			context.fill();
			angular.forEach(points, function drawPoint(point) {
				point.draw(context);
			});
		};

		return self;
	}

	module.exports = Polygon;
})();
