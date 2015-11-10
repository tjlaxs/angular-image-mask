/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');
	var EditControl = require('./editcontrol');

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
			if(dirScope.config.mode === 'edit' && controller.startDrag(mouseX, mouseY)) {
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
				updateMouse(evt.x, evt.y);
				console.log('starting to drag');
				controller.drag(mouseX, mouseY);
				console.log('stopping drag and starting draw');
				draw();
				console.log('stopping draw');
			}
		}

		function mouseUpListener(evt) {
			updateMouse(evt.x, evt.y);
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
			scope.$watch('config.mode', function(newValue) {
				switch(newValue) {
					case 'edit':
						controller = new EditControl(dirScope, mask);
						break;
/*
					case 'poly':
						controller = new PolyControl(dirScope, mask);
						break;
*/
				}
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
