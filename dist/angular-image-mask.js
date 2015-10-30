(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');

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
		var dirScope = null;

		function init(element, scope) {
			dirScope = scope;
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
			dirScope.$apply();
		}

		function link(scope, element/*, attrs*/) {
			init(element, scope);
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

},{"./mask":2}],2:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Polygon = require('./polygon');
	/*
	var Line = require('./line');
	var Rectangle = require('./rectangle');
	*/

	function Mask(shapeList) {
		var self = this;

		var json = shapeList;
		var shapes = [];
		var dragging = false;
		var selectedObject = null;

		/*
		* Initialization
		*/

		angular.forEach(shapeList, function(shape) {
			switch(shape.type) {
				case 'Polygon':
					shapes.push(new Polygon(shape));
					break;
				/*
				case 'Line':
					shapes.push(new Line(shape));
					break;
				case 'Rectangle':
					shapes.push(new Rectangle(shape));
					break;
				*/
				default:
					console.warn('Unknown shape: ' + shape.type);
					break;
			}
		});

		/*
		* Methods
		*/

		self.getJson = function getJson() {
			return json;
		};

		self.getDragging = function() {
			return dragging;
		};
		self.setDragging = function(val) {
			dragging = val ? true : false;
		};

		self.draw = function(context) {
			angular.forEach(shapes, function(shape) {
				shape.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			for(var i = 0; i < shapes.length; i++) {
				var points = shapes[i].getPoints();
				for(var j = 0; j < points.length; j++) {
					if(points[j].hit(mx, my)) {
						self.dragging = true;
						selectedObject = points[j];
						return true;
					}
				}
				points = null;
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

},{"./polygon":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
			context.fillStyle = 'hsla(120,100%,75%, 0.3)';
			context.fill();
			angular.forEach(points, function drawPoint(point) {
				point.draw(context);
			});
		};

		return self;
	}

	module.exports = Polygon;
})();

},{"./shape":5}],5:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Point = require('./point');

	function Shape(conf) {
		var self = this;

		/*
		* Initialization
		*/
		
		var json = conf;
		var name = conf.name;
		var type = conf.type;
		var points = [];

		angular.forEach(conf.data, function(value) {
			points.push(new Point(value));
		});
	
		/*
		* Public methods
		*/
	
		self.setName = function(newName) {
			name = newName;
		};
		self.getName = function() {
			return name;
		};
	
		self.getType = function() {
			return type;
		};
	
		self.getJson = function() {
			return json;
		};

		self.getPoints = function() {
			return points;
		};

		self.draw = function drawPoints(context) {
			angular.forEach(points, function drawPoints(point) {
				point.draw(context);
			});
		};
	
		return self;
	}

	module.exports = Shape;
})();

},{"./point":3}]},{},[1]);
