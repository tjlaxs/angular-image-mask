(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* globals require, angular */
(function() {
	'use strict';

	var Mask = require('./mask.js');

	var aim = angular.module('tjlaxs.aim', []);

	aim.controller('imageMaskController', function() {
	});

	aim.directive('tjlImageMask', function() {
		var ctx = null;
		var canvas = null;
		var mask = null;
		var bRect = null;
		var mouseX = 0;
		var mouseY = 0;
		var rootScope = null;

		function init(element, scope) {
			rootScope = scope;
			canvas = element[0];
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			mask = new Mask(scope.paths);
			canvas.addEventListener('mousedown', mouseDownListener, false);
			canvas.addEventListener('mouseup', mouseUpListener, false);
			bRect = canvas.getBoundingClientRect();
		}

		function updateMouse(x, y) {
			mouseX = (x - bRect.left) * (canvas.width / bRect.width);
			mouseY = (y - bRect.top) * (canvas.height / bRect.height);
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			mask.draw(ctx);
		}

		function mouseDownListener(evt) {
			updateMouse(evt.x, evt.y);
			if(mask.startDrag(mouseX, mouseY)) {
				canvas.addEventListener('mousemove', mouseMoveListener, false);
			}

			// Prevent event going further
			if (evt.preventDefault) {
				evt.preventDefault();
			}
			else if (evt.returnValue) {
				evt.returnValue = false;
			}
		}

		function mouseMoveListener(evt) {
			if(mask.dragging) {
				updateMouse(evt.x, evt.y);
				mask.moveDrag(mouseX, mouseY);
				draw();
			}
		}

		function mouseUpListener(evt) {
			updateMouse(evt.x, evt.y);
			mask.stopDrag();
			canvas.removeEventListener('mousemove', mouseMoveListener, false);
			console.log('UP');
			console.log(rootScope.paths);
			rootScope.$digest();
		}

		function link(scope, element/*, attrs*/) {
			init(element, scope);
			scope.$watch('paths', function() {
				console.log(scope.paths);
			});
			draw();
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
/* globals require, angular, module */
(function() {
	'use strict';

	var Path = require('./path.js');

	function Mask(pathList) {
		var self = this;

		var json = pathList;
		var paths = [];
		self.dragging = false;
		var selectedObject = null;

		/*
		 * Initialization
		 */

		angular.forEach(json, function(value) {
			paths.push(new Path(value));
		});

		/*
		 * Methods
		 */

		self.draw = function(context) {
			console.log(self);
			angular.forEach(paths, function(path) {
				path.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			for(var i = 0; i < paths.length; i++) {
				for(var j = 0; j < paths[i].points.length; j++) {
					if(paths[i].points[j].hit(mx, my)) {
						console.log('point was clicked');
						self.dragging = true;
						selectedObject = paths[i].points[j];
						return true;
					}
				}
			}
			return false;
		};

		self.stopDrag = function() {
			self.dragging = false;
			selectedObject = null;
		};

		self.moveDrag = function(mx, my) {
			selectedObject.moveTo(mx, my);
		};

		return self;
	}

	module.exports = Mask;
})();

},{"./path.js":3}],3:[function(require,module,exports){
/* globals require, angular, module */
(function() {
	'use strict';

	var Point = require('./point.js');

	function Path(path) {
		var self = this;

		var json = null;
		var name = path.name;
		var type = path.type;
		self.points = [];

		/*
		 * Initialization
		 */

		json = path;

		angular.forEach(path.data, function(value) {
			self.points.push(new Point(value));
		});

		/*
		 * Methods
		 */

		self.name = function() { return name; };
		self.type = function() { return type; };

		self.draw = function(context) {
			console.log(self);
			for(var i = 0; i < self.points.length - 1; i++) {
				console.log(self.points[i].x, self.points[i].y);
				context.beginPath();
				context.moveTo(self.points[i].x, self.points[i].y);
				context.lineTo(self.points[i+1].x, self.points[i+1].y);
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
/* globals angular, module */
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
			console.log(self);
			var dx = px - x;
			var dy = py - y;
			return Math.sqrt(dx*dx + dy*dy);
		};

		self.hit = function(mx, my) {
			return self.distance(mx, my) < r;

		};

		self.moveTo = function(mx, my, mr) {
			console.log('MOVE');
			console.log(self);
			x = json[0] = mx;
			y = json[1] = my;
			if(json.length > 2) {
				r = json[2] = mr || r;
			}
			return self;
		};

		self.draw = function(context) {
			console.log(self);
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, true);
			context.stroke();
		};

		return self;
	}

	module.exports = Point;
})();

},{}]},{},[1]);
