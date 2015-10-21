(function() {
	'use strict';

	var Path = require('./path.js');

	function Mask(paths) {
		var self = this;

		self.json = paths;
		self.paths = [];

		angular.forEach(self.json, function(value, key) {
			self.paths.push(new Path(value));
		});

		self.draw = function(context) {
			console.log(self);
			angular.forEach(self.paths, function(path) {
				path.draw(context);
			});
		};

		return self;
	}

	module.exports = Mask;
})();
