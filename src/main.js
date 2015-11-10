/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');
	var EditControl = require('./editcontrol');
	var PolyControl = require('./polycontrol');

	var aim = angular.module('tjlaxs.aim', []);

	aim.directive('tjlImageMask', function() {
		var ctx = null;
		var canvas = null;
		var mask = null;
		var bRect = null;
		var mouseX = 0;
		var mouseY = 0;
		var dirScope = null;
		var controller;

		function updateMouse(evt) {
			mouseX = (evt.x - bRect.left) * (canvas.width / bRect.width);
			mouseY = (evt.y - bRect.top) * (canvas.height / bRect.height);
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			mask.draw(ctx);
		}

		function mouseDownListener(evt) {
			updateMouse(evt);
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
				updateMouse(evt);
				controller.drag(mouseX, mouseY);
				draw();
			}
		}

		function mouseUpListener(evt) {
			updateMouse(evt);
			controller.stopDrag(mouseX, mouseY);
			canvas.removeEventListener('mousemove', mouseEditMoveListener, false);
			dirScope.$apply();
		}

		function link(scope, element/*, attrs*/) {
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
					default:
						return;
				}
				console.log(old);
				old.deinit();
				console.log(controller);
				controller.init();
			});

			canvas.addEventListener('mousedown', mouseDownListener, false);
			canvas.addEventListener('mouseup', mouseUpListener, false);
			bRect = canvas.getBoundingClientRect();
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
			if(angular.isUndefined(scope.config.control.mode)) {
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
