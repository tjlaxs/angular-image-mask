(function() {
	'use strict';

	var Path = require('./path.js');

	function Mask(paths) {
		var self = this;
		self.json = paths;
		self.paths = [];
		angular.forEach(self.json, function(value, key) {
			self.push(new Path(value));
		});
		return self;
	}

	Mask.prototype.draw = function(context) {
		angular.forEach(this.paths, function(path) {
			console.log(this);
			path.draw(context);
		});
	};

	module.exports = Mask;
})();
