(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint node:true */
(function() {
	'use strict';

	function Control(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		var _scope = scope;
		var _mask = mask;
		var _dragging = false;
		var _mouseX = null;
		var _mouseY = null;
	
		/*
		* Public methods
		*/

		self.getMask = function() {
			return _mask;
		};
		self.getScope = function() {
			return _scope;
		};
		self.getDragging = function() {
			return _dragging;
		};
		self.setDragging = function(val) {
			_dragging = !!val;
		};

		self.init = function() {console.log('init');};
		self.deinit = function() {console.log('deinit');};

		self.updateMouse = function(x, y) {
			_mouseX = x;
			_mouseY = y;
		};
	
		// Called when dragging starts
		self.startDrag = function(x, y) {
			self.updateMouse(x, y);
			return false;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.updateMouse(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.updateMouse(x, y);
		};

		return self;
	}

	module.exports = Control;
})();

},{}],2:[function(require,module,exports){
/* jshint node:true */
(function() {
	'use strict';

	var Control = require('./control');

	function EditControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		// Called when dragging starts
		self.startDrag = function(x, y) {
			if(self.getMask().startDrag(x, y)) {
				self.setDragging(true);
				return true;
			}
			return false;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.getMask().stopDrag(x, y);
			self.setDragging(false);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	EditControl.prototype = Object.create(Control.prototype);
	EditControl.prototype.constructor = EditControl;	

	module.exports = EditControl;
})();


},{"./control":1}],3:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Shape = require('./shape');

	function Line(conf) {
		var self = this;

		/*
		* Initialization
		*/

		var strokeColor = '#ffffff';
		Shape.call(self, conf);

		self.setMaxPoints(2);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			context.strokeStyle = strokeColor;

			var points = self.getPoints();
			if(angular.isArray(points) && points.length >= 2) {
				context.beginPath();
				context.moveTo(points[0].x, points[0].y);
				context.lineTo(points[1].x, points[1].y);
				context.stroke();
				for(var i = 0; i < 2; i++) {
					points[i].draw(context);
				}
			}

			context.strokeStyle = savedColor;
		};

		return self;
	}

	Line.prototype = Object.create(Shape.prototype);
	Line.prototype.constructor = Line;

	module.exports = Line;
})();

},{"./shape":12}],4:[function(require,module,exports){
/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Line = require('./line');
	var Control = require('./control');

	function LineControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var lineConf = {name:'Line', type:'Line', data:[]};
			var line = new Line(lineConf);
			self.getMask().addShape(line);
			self.getMask().setSelectedShape(line);
			console.log('line init');
		};

		self.deinit = function() {
			var shape = self.getMask().getSelectedShape();
			var points = shape.getPoints();

			if(points.length < 2) {
				self.getMask().removeShape(shape);
			}

			self.getMask().setSelectedShape(null);
			console.log('line deinit');
		};

		// Called when dragging starts
		self.startDrag = function(x, y) {
			var point = new Point(x, y);
			self.getMask().addPoint(point);
			self.getMask().setSelectedPoint(point);
			self.getMask().startDrag();
			self.setDragging(true);
			return true;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.setDragging(false);
			self.getMask().stopDrag(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	LineControl.prototype = Object.create(Control.prototype);
	LineControl.prototype.constructor = LineControl;	

	module.exports = LineControl;
})();


},{"./control":1,"./line":3,"./point":7}],5:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');
	var EditControl = require('./editcontrol');
	var PolyControl = require('./polycontrol');
	var LineControl = require('./linecontrol');
	var RectControl = require('./rectcontrol');

	var aim = angular.module('tjlaxs.aim', []);

	aim.controller('tjlAimController', ['$scope', function tjlAimController($scope) {
		$scope.removeShape = function(shape) {
			var shapes = $scope.config.shapes;
			var index = shapes.indexOf(shape);
			if(index !== -1) {
				shapes.splice(index, 1);
			}
		};

		$scope.removePoint = function(shape, point) {
			var index = shape.data.indexOf(point);
			if(index !== -1) {
				shape.data.splice(index, 1);
			}
		};

		$scope.test = function() {
			console.log('it works');
		};
	}]);

	aim.directive('tjlImageMask', function() {
		function link(scope, element, attrs, aimController) {
			var ctx = null;
			var canvas = null;
			var mask = null;
			var mouseX = 0;
			var mouseY = 0;
			var dirScope = null;
			var controller;

			function updateMouse(evt, element) {
				var rect = element.getBoundingClientRect();
				var scrollTop = document.documentElement.scrollTop ?
						document.documentElement.scrollTop :
						document.body.scrollTop;
				var scrollLeft = document.documentElement.scrollLeft ?
						document.documentElement.scrollLeft :
						document.body.scrollLeft;
				var elementLeft = rect.left + scrollLeft;
				var elementTop = rect.top + scrollTop;
	
				mouseX = evt.pageX - elementLeft;
				mouseY = evt.pageY - elementTop;
			}
	
			function draw() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				mask.draw(ctx);
			}
	
			function mouseDownListener(evt) {
				updateMouse(evt, canvas);
				if(controller.startDrag(mouseX, mouseY)) {
					canvas.addEventListener('mousemove', mouseEditMoveListener, false);
				}
	
				// Prevent event going further
				if (evt.preventDefault) {
					evt.preventDefault();
				}
				else if (evt.returnValue) {
					evt.returnValue = false;
				}
			}
	
			function mouseEditMoveListener(evt) {
				if(controller.getDragging()) {
					updateMouse(evt, canvas);
					controller.drag(mouseX, mouseY);
					draw();
				}
			}
	
			function mouseUpListener(evt) {
				updateMouse(evt, canvas);
				controller.stopDrag(mouseX, mouseY);
				canvas.removeEventListener('mousemove', mouseEditMoveListener, false);
				dirScope.$apply();
			}

			dirScope = scope;
			canvas = element[0];
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';

			mask = new Mask(scope.config.shapes);
			scope.$watch('config.shapes', function(newValue) {
				if(!angular.isUndefined(newValue)) {
					mask.setConfig(scope.config.shapes);
					draw();
				}
			}, true);

			controller = new EditControl(dirScope, mask);
			scope.$watch('config.control.mode', function(newValue) {
				var old = controller;
				switch(newValue) {
					case 'edit':
						controller = new EditControl(dirScope, mask);
						break;
					case 'poly':
						controller = new PolyControl(dirScope, mask);
						break;
					case 'line':
						controller = new LineControl(dirScope, mask);
						break;
					case 'rect':
						controller = new RectControl(dirScope, mask);
						break;
					default:
						return;
				}
				console.log(old);
				old.deinit();
				console.log(controller);
				controller.init();
			});

			aimController.test();

			canvas.addEventListener('mousedown', mouseDownListener, false);
			canvas.addEventListener('mouseup', mouseUpListener, false);
			draw();
		}

		var ret = {
			require: '^^tjlAimController',
			restrict: 'A',
			link: link,
			scope: {
				config: '='
			}
		};

		return ret;
	});

	aim.directive('tjlImageMaskControl', function() {
		function link(scope, element, attrs, aimController) {
			if(angular.isUndefined(scope.config.control.mode)) {
				scope.config.mode = 'edit';
			}

			scope.removeShape = function(shape) {
				aimController.removeShape(shape);
			};

			scope.removePoint = function(shape, point) {
				aimController.removePoint(shape, point);
			};
		}

		var ret = {
			restrict: 'E',
			require: '^tjlAimController',
			link: link,
			templateUrl: 'templates/image-mask.part.html',
			scope: {
				config: '='
			}
		};

		return ret;
	});
})();

},{"./editcontrol":2,"./linecontrol":4,"./mask":6,"./polycontrol":8,"./rectcontrol":11}],6:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Polygon = require('./polygon');
	var Line = require('./line');
	var Rectangle = require('./rectangle');
	var Shape = require('./shape');

	function Mask(shapeList) {
		var self = this;

		var json = shapeList;
		var shapes = [];
		var selectedShape = null;
		var selectedPoint = null;

		/*
		* Exceptions
		*/

		function NoSuchShape() {
			this.name = 'NoSuchShape';
			this.message = 'This shape could not be found in the shape list.';
		}

		function UnidentifiedShape() {
			this.name = 'UnidentifiedShape';
			this.message = 'Could not confirm the passed parameter as a shape.';
		}

		/*
		* Methods
		*/

		self.getJson = function() {
			return json;
		};

		self.getShapes = function() {
			return shapes;
		};

		self.setConfig = function(config) {
			var selectedShapeJson = null;
			if(selectedShape !== null) {
				selectedShapeJson = selectedShape.getJson();
			}
			selectedShape = null;
			shapes = [];
			angular.forEach(config, function initializeShapes(shape) {
				switch(shape.type) {
					case 'Polygon':
						shapes.push(new Polygon(shape));
						break;
					case 'Line':
						shapes.push(new Line(shape));
						break;
					case 'Rectangle':
						shapes.push(new Rectangle(shape));
						break;
					default:
						console.warn('Unknown shape: ' + shape.type);
						break;
				}
			});
			for(var i = 0; i < shapes.length; i++) {
				if(shapes[i].getJson() === selectedShapeJson) {
					console.log('found the right shape');
					selectedShape = shapes[i];
					break;
				}
			}
		};

		self.draw = function(context) {
			angular.forEach(shapes, function drawShapes(shape) {
				shape.draw(context);
			});
		};

		self.startDrag = function(mx, my) {
			var hit = self.onPoint(mx, my);
			if(hit) {
				selectedPoint = hit;
				return true;
			}
			return false;
		};

		self.onPoint = function(mx, my) {
			for(var i = 0; i < shapes.length; i++) {
				var points = shapes[i].getPoints();
				for(var j = 0; j < points.length; j++) {
					if(points[j].hit(mx, my)) {
						return points[j];
					}
				}
				points = null;
			}
			return false;
		};

		self.stopDrag = function() {
			selectedPoint = null;
		};

		self.drag = function(mx, my) {
			selectedPoint.moveTo(mx, my);
		};

		self.addShape = function(shape) {
			shapes.push(shape);
			json.push(shape.getJson());
			console.log(shape);
			console.log(json);
		};

		self.removeShape = function(shape) {
			var index = null;
			var jsonIndex = null;
			if(angular.isObject(shape)) {
				if(shape instanceof Shape) {
					index = shapes.indexOf(shape);
					jsonIndex = json.indexOf(shape.getJson());
				} else {
					for(var i = 0; i < shapes.length; i++) {
						if(shapes[i].getJson() === shape) {
							index = i;
							jsonIndex = json.indexOf(shape);
							break;
						}
					}
				}
				if(index === -1) {
					throw new NoSuchShape();
				}
			} else {
				throw new UnidentifiedShape();
			}

			json.splice(jsonIndex, 1);
			shapes.splice(index, 1);
		};

		self.getSelectedShape = function() {
			return selectedShape;
		};

		self.setSelectedShape = function(shape) {
			selectedShape = shape;
		};

		self.getSelectedPoint = function() {
			return selectedPoint;
		};

		self.setSelectedPoint = function(point) {
			selectedPoint = point;
		};

		self.addPoint = function(point) {
			selectedPoint = point;
			selectedShape.addPoint(point);
		};

		/*
		* Initialization
		*/

		self.setConfig(shapeList);

		return self;
	}

	module.exports = Mask;
})();

},{"./line":3,"./polygon":9,"./rectangle":10,"./shape":12}],7:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	function Point(dx, dy, dr) {
		var self = this;
		var defaultR = 10;
		var x = 0;
		var y = 0;
		var r = 0;
		var strokeColor = '#000000';
		var fillColor = 'rgba(255, 255, 255, 0.3)';
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
		* Methods
		*/

		self.toString = function() {
			return '(' + x + ', ' + y + ')';
		};

		self.setColor = function(color, fillColor) {
			strokeColor = color;
			self.setFillColor(fillColor);
		};
		self.setFillColor = function(color) {
			fillColor = color;
		};

		self.getJson = function() {
			return json;
		};

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
			var savedColor = context.strokeStyle;
			var savedFillColor = context.fillStyle;
			context.strokeStyle = strokeColor;
			context.fillStyle = fillColor;
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, true);
			context.stroke();
			context.fill();
			context.strokeStyle = savedColor;
			context.fillStyle = savedFillColor;
		};

		/*
		* Initialization
		*/

		if(angular.isArray(dx)) {
			json = dx;
			x = dx[0] || 0;
			y = dx[1] || 0;
			r = dx[2] || defaultR;
		} else {
			json = [];
			self.moveTo(dx, dy, dr || defaultR);
		}

		return self;
	}

	module.exports = Point;
})();

},{}],8:[function(require,module,exports){
/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Polygon = require('./polygon');
	var Control = require('./control');

	function PolyControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var polyConf = {name:'Polygon', type:'Polygon', data:[]};
			var poly = new Polygon(polyConf);
			self.getMask().addShape(poly);
			self.getMask().setSelectedShape(poly);
			console.log('poly init');
		};

		self.deinit = function() {
			self.getMask().setSelectedShape(null);
			console.log('poly deinit');
		};

		// Called when dragging starts
		self.startDrag = function(x, y) {
			var point = new Point(x, y);
			self.getMask().addPoint(point);
			self.getMask().setSelectedPoint(point);
			self.getMask().startDrag();
			self.setDragging(true);
			return true;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.setDragging(false);
			self.getMask().stopDrag(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	PolyControl.prototype = Object.create(Control.prototype);
	PolyControl.prototype.constructor = PolyControl;	

	module.exports = PolyControl;
})();


},{"./control":1,"./point":7,"./polygon":9}],9:[function(require,module,exports){
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
		var strokeColor = '#ffffff';
		var fillColor = 'rgba(0, 0, 0, 0.3)';
		Shape.call(self, conf);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			var savedFillColor = context.fillStyle;
			context.strokeStyle = strokeColor;
			context.fillStyle = fillColor;

			var points = self.getPoints();
			if(angular.isArray(points) && points.length > 0) {
				context.beginPath();
				context.moveTo(points[0].x, points[0].y);
				for(var i = 1; i < points.length; i++) {
					context.lineTo(points[i].x, points[i].y);
				}
				context.closePath();
				context.stroke();
				context.fill();
				angular.forEach(points, function drawPoint(point) {
					point.draw(context);
				});
			}

			context.strokeStyle = savedColor;
			context.fillStyle = savedFillColor;
		};

		return self;
	}

	Polygon.prototype = Object.create(Shape.prototype);
	Polygon.prototype.constructor = Polygon;

	module.exports = Polygon;
})();

},{"./shape":12}],10:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Shape = require('./shape');

	function Rectangle(conf) {
		/*
		* Initialization
		*/

		var self = this;
		var strokeColor = '#ffffff';
		var fillColor = 'rgba(0, 0, 0, 0.3)';
		Shape.call(self, conf);

		self.setMaxPoints(2);

		/*
		* Public methods
		*/

		self.draw = function(context) {
			var savedColor = context.strokeStyle;
			var savedFillColor = context.fillStyle;
			context.strokeStyle = strokeColor;
			context.fillStyle = fillColor;

			var points = self.getPoints();
			if(angular.isArray(points) && points.length === 2) {
				var x = points[0].x;
				var y = points[0].y;
				var w = points[1].x - x;
				var h = points[1].y - y;

				context.fillRect(x, y, w, h);
				context.strokeRect(x, y, w, h);
				angular.forEach(points, function drawPoint(point) {
					point.draw(context);
				});
			}

			context.strokeStyle = savedColor;
			context.fillStyle = savedFillColor;
		};

		return self;
	}

	Rectangle.prototype = Object.create(Shape.prototype);
	Rectangle.prototype.constructor = Rectangle;

	module.exports = Rectangle;
})();

},{"./shape":12}],11:[function(require,module,exports){
/* jshint node:true */
(function() {
	'use strict';

	var Point = require('./point');
	var Rectangle = require('./rectangle');
	var Control = require('./control');

	function RectControl(scope, mask) {
		var self = this;

		/*
		* Initialization
		*/

		Control.call(self, scope, mask);

		/*
		* Public methods
		*/

		self.init = function() {
			var rectConf = {name:'Rectangle', type:'Rectangle', data:[]};
			var rect = new Rectangle(rectConf);
			self.getMask().addShape(rect);
			self.getMask().setSelectedShape(rect);
			console.log('rect init');
		};

		self.deinit = function() {
			var shape = self.getMask().getSelectedShape();
			var points = shape.getPoints();

			if(points.length < 2) {
				self.getMask().removeShape(shape);
			}

			self.getMask().setSelectedShape(null);
			console.log('rect deinit');
		};

		// Called when dragging starts
		self.startDrag = function(x, y) {
			var point = new Point(x, y);
			self.getMask().addPoint(point);
			self.getMask().setSelectedPoint(point);
			self.getMask().startDrag();
			self.setDragging(true);
			return true;
		};

		// Called when dragging stops
		self.stopDrag = function(x, y) {
			self.setDragging(false);
			self.getMask().stopDrag(x, y);
		};

		// Called while dragging
		self.drag = function(x, y) {
			self.getMask().drag(x, y);
		};

		return self;
	}

	RectControl.prototype = Object.create(Control.prototype);
	RectControl.prototype.constructor = RectControl;	

	module.exports = RectControl;
})();


},{"./control":1,"./point":7,"./rectangle":10}],12:[function(require,module,exports){
/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Point = require('./point');

	function Shape(conf) {
		var self = this;

		// Default to supplied shape or empty polygon
		var json = conf || {name: 'Shape', type: 'Polygon', data: []};
		var name = json.name;
		var type = json.type;
		var points = [];
		var limited = false;
		var maxPoints = 0;

		/*
		* Exceptions
		*/

		function MaxPointsReached() {
			this.name = 'MaxPointsReached';
			this.message = 'The shape had already full set of points and no new point could be added. ';
		}

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

		self.setMaxPoints = function(newMax) {
			maxPoints = Math.abs(newMax);
			if(maxPoints !== 0) {
				limited = true;
			} else {
				limited = false;
			}
		};
		self.getMaxPoints = function() {
			return maxPoints;
		};

		self.getNumPoints = function() {
			return points.length;
		};

		self.getPoints = function() {
			return points;
		};
		self.addPoint = function(x, y) {
			var point;
			if(limited && self.getNumPoints() === self.getMaxPoints()) {
				throw new MaxPointsReached();
			}
			if(angular.isArray(x)) {
				point = new Point(x);
			} else if(angular.isObject(x)) {
				point = x;
			} else {
				point = new Point(x, y);
			}

			json.data.push(point.getJson());
			points.push(point);
		};

		self.draw = function shapeDraw(context) {
			angular.forEach(points, function shapeDrawPoint(point) {
				point.draw(context);
			});
		};

		/*
		* Initialization
		*/

		angular.forEach(json.data, function initializePoints(value) {
			points.push(new Point(value));
		});

		return self;
	}

	module.exports = Shape;
})();

},{"./point":7}]},{},[5]);
