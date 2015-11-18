/* jshint node:true */
/* globals angular */
(function() {
	'use strict';

	var Mask = require('./mask');
	var EditControl = require('./editcontrol');
	var PolyControl = require('./polycontrol');
	var LineControl = require('./linecontrol');

	var aim = angular.module('tjlaxs.aim', []);

	aim.directive('tjlImageMask', function() {
		function link(scope, element/*, attrs*/) {
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

			console.log(dirScope);
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
