(function() {
	'use strict';

	var Mask = require('./mask.js');

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
			debug.log(scope);

			var ctx = element[0].getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			var img = new Image();
			img.src = attrs.src;
			var mask = new Mask(scope.paths);

			img.onload = function() {
				debug.log("Image loaded: " + img.src);
				mask.draw(ctx);
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
