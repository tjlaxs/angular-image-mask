/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	function Point(dx, dy, dr) {
		var self = this;
		var defaultR = 5;
		var x = 0;
		var y = 0;
		var r = 0;
		var json = null;

		Object.defineProperties(self, {
			'x': {
				get: function() {
					return x;
				}
			},
			'y': {
				get: function() {
					return y;
				}
			},
			'r': {
				get: function() {
					return r;
				}
			}
		});

		/*
		* Initialization
		*/

		if(angular.isArray(dx)) {
			json = dx;
			x = dx[0] || 0;
			y = dx[1] || 0;
			r = dx[2] || defaultR;
		} else {
			self.moveTo(dx, dy, dr || defaultR);
		}

		/*
		* Methods
		*/

		self.distance = function(px, py) {
			var dx = px - x;
			var dy = py - y;
			return Math.sqrt(dx*dx + dy*dy);
		};

		self.hit = function(mx, my) {
			return self.distance(mx, my) < r;
		};

		self.moveTo = function(mx, my, mr) {
			x = json[0] = Math.round(mx);
			y = json[1] = Math.round(my);
			if(json.length > 2) {
				r = json[2] = mr || r;
			}
			return self;
		};

		self.draw = function(context) {
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, true);
			context.stroke();
		};

		return self;
	}

	module.exports = Point;
})();
