/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');

	var aim = angular.module('tjlaxs.aim', []);

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
			mask = new Mask(scope.config.shapes);
			scope.$watch('config.shapes', function(newValue) {
				if(!angular.isUndefined(newValue)) {
					mask = new Mask(scope.config.shapes);
					draw();
				}
			}, true);
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
			if(dirScope.config.mode === 'edit' && mask.startDrag(mouseX, mouseY)) {
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
			if(mask.dragging) {
				updateMouse(evt.x, evt.y);
				mask.moveDrag(mouseX, mouseY);
				draw();
			}
		}

		function mouseUpListener(evt) {
			updateMouse(evt.x, evt.y);
			mask.stopDrag();
			canvas.removeEventListener('mousemove', mouseEditMoveListener, false);
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
				config: '='
			}
		};

		return ret;
	});

	aim.directive('tjlImageMaskControl', function() {
		function link(scope) {
			if(angular.isUndefined(scope.config.mode)) {
				scope.config.mode = 'edit';
			}
		}

		var ret = {
			restrict: 'E',
			link: link,
			templateUrl: 'templates/image-mask.part.html',
			scope: {
				config: '='
			}
		};

		return ret;
	});
})();
