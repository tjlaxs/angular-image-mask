(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	'use strict';

	var Mask = require('./mask.js');

	var aim = angular.module('tjlaxs.aim', []);

	aim.controller('imageMaskController', ['$scope', function($scope) {
	}]);


	aim.directive('tjlImageMask', function() {
		function link(scope, element, attrs) {
			var ctx = element[0].getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			var mask = new Mask(scope.paths);

			scope.$watch('paths', function() {
				console.log(scope.paths);
				mask.draw(ctx);
			});
		}

		var ret = {
			restrict: 'A',
			link: link,
			scope: {
				paths: '='
			}
		};

		return ret;
	});

})();

},{"./mask.js":2}],2:[function(require,module,exports){
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

},{"./path.js":3}],3:[function(require,module,exports){
(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		var self = this;

		self.json = path;
		self.name = path.name;
		self.type = path.type;
		self.points = [];

		angular.forEach(path.data, function(value, key) {
			self.points.push(new Point(value));
		});

		self.draw = function(context) {
			console.log(self);
			for(var i = 0; i < self.points.length - 1; i++) {
				context.beginPath();
				context.moveTo(self.points[i][0], self.points[i][1]);
				context.moveTo(self.points[i+1][0], self.points[i+1][1]);
				context.stroke();
			}
			angular.forEach(self.points, function(point) {
				point.draw(context);
			});
		};

		return self;
	}

	module.exports = Path;
})();

},{"./point.js":4}],4:[function(require,module,exports){
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

},{}]},{},[1]);
