(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	'use strict';

	var Mask = require('./mask.js');

	var aim = angular.module('tjlaxs.aim', []);

	var debug = { state: true };
	debug.log = function(string) {
		if(debug.state === true) {
			console.log(string);
		}
	};

	aim.controller('imageMaskController', ['$scope', function($scope) {
	}]);


	aim.directive('tjlImageMask', function() {
		function link(scope, element, attrs) {
			debug.log(scope);

			var ctx = element[0].getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			var img = new Image();
			img.src = attrs.src;
			var mask = new Mask(scope.paths);

			img.onload = function() {
				debug.log("Image loaded: " + img.src);
				mask.draw(ctx);
			};
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
		this.json = paths;
		this.paths = [];
		angular.forEach(this.json, function(value, key) {
			this.paths.push(new Path(value));
		});
		return this;
	}

	Mask.prototype.draw = function(context) {
		angular.forEach(this.paths, function(path) {
			console.log(this);
			path.draw(context);
		});
	};

	module.exports = Mask;
})();

},{"./path.js":3}],3:[function(require,module,exports){
(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		this.json = path;
		this.name = path.name;
		this.type = path.type;
		this.points = [];
		angular.forEach(path.data, function(value, key) {
			this.points.push(new Point(value));
		});
		return this;
	}

	Path.prototype.draw = function(context) {
		console.log(this);
		for(var i = 0; i < this.points.length - 1; i++) {
			context.beginPath();
			context.moveTo(this.points[i][0], this.points[i][1]);
			context.moveTo(this.points[i+1][0], this.points[i+1][1]);
			context.stroke();
		}
		angular.forEach(this.points, function(point) {
			point.draw(context);
		});
	};

	module.exports = Path;
})();

},{"./point.js":4}],4:[function(require,module,exports){
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

},{}]},{},[1]);
