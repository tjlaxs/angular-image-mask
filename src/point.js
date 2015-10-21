(function() {
	'use strict';

	function Point(x, y, r) {
		var self = this;

		if(angular.isArray(x)) {
			self.json = x;
			self.x = x[0];
			self.y = x[1];
			self.r = x[2];
		} else {
			self.moveTo(x, y, r);
		}

		self.distance = function(px, py) {
			console.log(self);
			var dx = px - self.x;
			var dy = py - self.y;
			return Math.sqrt(dx*dx + dy*dy);
		};

		self.moveTo = function(x, y, r) {
			console.log(self);
			self.x = x;
			self.y = y;
			self.r = r || self.r;
			self.json = [x, y, r];
			return self;
		};

		self.draw = function(context) {
			console.log(self);
			context.beginPath();
			context.arc(self.x, self.y, self.r, 0, Math.PI*2, true);
			context.stroke();
		};

		return self;
	}

	module.exports = Point;
})();
