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
