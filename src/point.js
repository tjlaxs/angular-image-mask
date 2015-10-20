(function() {
	'use strict';
	
	function Point(x, y, r) {
		if(angular.isArray(x)) {
			this.json = x;
			this.x = x[0];
			this.y = x[1];
			this.r = x[2];
		} else {
			this.moveTo(x, y, r);
		}
		return this;
	}


	Point.prototype.distance = function(px, py) {
		var dx = px - this.x;
		var dy = py - this.y;
		return Math.sqrt(dx*dx + dy*dy);
	};
	
	Point.prototype.moveTo = function(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r || this.r;
		this.json = [x, y, r];
		return this;
	};
	
	Point.prototype.draw = function(context) {
		console.log(this);
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
		context.stroke();
	};

	module.exports = Point;
})();
