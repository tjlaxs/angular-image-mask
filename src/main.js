(function() {
	'use strict';

	var Mask = require('./mask.js');

	var aim = angular.module('tjlaxs.aim', []);

	aim.controller('imageMaskController', ['$scope', function($scope) {
	}]);


	aim.directive('tjlImageMask', function() {
		function link(scope, element, attrs) {
			var ctx = element[0].getContext('2d');
			ctx.strokeStyle = 'rgb(200, 20, 10)';
			var mask = new Mask(scope.paths);

			scope.$watch('paths', function() {
				console.log(scope.paths);
				mask.draw(ctx);
			});
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
