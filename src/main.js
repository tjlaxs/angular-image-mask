(function() {
	'use strict';

	var Mask = require('./mask.js');

	var aim = angular.module('tjlaxs.aim', []);

	aim.controller('imageMaskController', ['$scope', function($scope) {
	}]);


	aim.directive('tjlImageMask', function() {
		var ctx = null;
		var canvas = null;
		var mask = null;

		function init(element, scope) {
			canvas = element[0];
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			mask = new Mask(scope.paths);
			canvas.addEventListener("mousedown", mouseDownListener, false);
			canvas.addEventListener("mouseup", mouseUpListener, false);
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			mask.draw(ctx);
		}

		function mouseDownListener(evt) {
			if(mask.startDrag(evt.clientX, evt.clientY)) {
				canvas.addEventListener("mousemove", mouseMoveListener, false);
			}
		}

		function mouseMoveListener(evt) {
			mask.moveDrag(evt.clientX, evt.clientY);
			draw();
		}

		function mouseUpListener(evt) {
			console.log("Up X,Y: " + evt.clientX + "," + evt.clientY);
			canvas.removeEventListener("mousemove", mouseMoveListener, false);
		}

		function link(scope, element, attrs) {
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
