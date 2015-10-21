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
		var bRect = null;
		var mouseX = 0;
		var mouseY = 0;

		function init(element, scope) {
			canvas = element[0];
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			mask = new Mask(scope.paths);
			canvas.addEventListener("mousedown", mouseDownListener, false);
			canvas.addEventListener("mouseup", mouseUpListener, false);
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
				canvas.addEventListener("mousemove", mouseMoveListener, false);
			}
		}

		function mouseMoveListener(evt) {
			updateMouse(evt.x, evt.y);
			mask.moveDrag(mouseX, mouseY);
			draw();
		}

		function mouseUpListener(evt) {
			updateMouse(evt.x, evt.y);
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
