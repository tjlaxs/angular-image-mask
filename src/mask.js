(function() {
	'use strict';

	var Path = require('./path.js');

	function Mask(pathList) {
		var self = this;

		var json = pathList;
		var paths = [];

		angular.forEach(json, function(value, key) {
			paths.push(new Path(value));
		});

		self.draw = function(context) {
			console.log(self);
			angular.forEach(paths, function(path) {
				path.draw(context);
			});
		};

		return self;
	}

	module.exports = Mask;
})();
