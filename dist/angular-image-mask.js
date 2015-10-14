(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
'use strict';

var Point = require('./point.js');

module.exports = function(name, p1, p2) {
	this.name = name || "Line";
	this.p = [];
	this.p[0] = p1 || new Point();
	this.p[1] = p2 || new Point();
	return this;
};

})();

},{"./point.js":3}],2:[function(require,module,exports){
(function() {
	'use strict';

	var Line = require('./line.js');

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
			function renderLine(context, data) {
				context.beginPath();
				context.moveTo(data[0], data[1]);
				context.lineTo(data[2], data[3]);
				context.stroke();

				context.beginPath();
				context.arc(data[0], data[1], 5, 0, Math.PI*2, true);
				context.stroke();

				context.beginPath();
				context.arc(data[2], data[3], 5, 0, Math.PI*2, true);
				context.stroke();
			}

			function renderCanvas(context, image, paths) {
				context.drawImage(image, 0, 0);
				debug.log('Rendering image:' + image.src);
				angular.forEach(paths, function(path) {
					var str = 'Rendering path: ';
					switch(path.type) {
						case 'Line':
							renderLine(context, path.data);
							break;
						default:
							debug.log('ERR: Unrenderable type:' + path.type);
							break;
					}
					angular.forEach(path.data, function(data) {
						str += data + ' ';
					});
					debug.log(str);
				});
			}
			
			debug.log(scope);

			var ctx = element[0].getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			var img = new Image();
			img.src = attrs.src;

			img.onload = function() {
				debug.log("Image loaded: " + img.src);
				renderCanvas(ctx, img, scope.paths);
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

},{"./line.js":1}],3:[function(require,module,exports){
(function() {
'use strict';

module.exports = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	return this;
};

module.exports.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};

})();

},{}]},{},[2]);
